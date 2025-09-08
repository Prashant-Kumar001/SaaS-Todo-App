import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { normalizeSubscription } from "@/lib/helper";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const User = await prisma.user.findUnique({
      where: { id: clerkUser.id },
    });

    if (!User) {
      return NextResponse.json(
        { error: "User not synced to DB yet" },
        { status: 404 }
      );
    }

    const Subscription = await normalizeSubscription(userId);


    const Todos = await prisma.todo.findMany({
      where: { userId: User.id },
      orderBy: { priority: "asc" },
    });

    return NextResponse.json({
      user: User,
      subscription: Subscription,
      todos: Todos || [],
    });
  } catch (error: any) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
