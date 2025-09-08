import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reqType = (await request.json()) as { type: string };

    const is_user_synced = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (is_user_synced) {
      return NextResponse.json(
        { message: "User already synced" },
        { status: 200 }
      );
    }

    const User = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.fullName ?? "",
        email: user.emailAddresses[0]?.emailAddress ?? "",
      },
    });

    const now = new Date();
    const trialEnds = new Date();
    trialEnds.setDate(now.getDate() + 7);

    const Subscription = await prisma.subscription.create({
      data: {
        userId: User.id,
        plan: "PRO",
        status: "TRIALING",
        trialEndsAt: trialEnds,
      },
    });

    const todo = await prisma.todo.create({
      data: {
        userId: User.id,
        title: "Hello, world!",
        description: "This is my first todo",
      },
    });

    return NextResponse.json(
      { user: User, subscription: Subscription, todos: [todo] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/user/sync error:", error);
    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
