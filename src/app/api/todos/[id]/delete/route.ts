import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const param = await params;

    const todo = await prisma.todo.deleteMany({
      where: { id: param.id, userId },
    });

    if (todo.count === 0)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}