import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const todo = await prisma.todo.updateMany({
      where: { id: params.id, userId },
      data: { completedAt: new Date() },
    });

    if (todo.count === 0)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: "Todo completed" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to complete todo" },
      { status: 500 }
    );
  }
}
