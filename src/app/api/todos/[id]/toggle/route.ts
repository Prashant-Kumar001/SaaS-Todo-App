import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { TodoPriority, TodoStatus } from "@prisma/client";
import { Action } from "@/types";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let id
        const param = await params;
        id = param.id



        const { id: todoId, status, priority, action } = await req.json() as {
            id: string;
            status?: TodoStatus;
            priority?: TodoPriority;
            action: Action;
        }


        if (!id || !id.trim())
            return NextResponse.json({ error: "Id is required" }, { status: 400 });

        if (action === 'PRIORITY') {
            const todo = await prisma.todo.update({
                where: { id: todoId, userId },
                data: {
                    priority: priority === "HIGH" ? "LOW" : "HIGH",
                    updatedAt: new Date()
                },
            });
            return NextResponse.json(todo, { status: 200 });
        } else if (action === 'STATUS') {
            const todo = await prisma.todo.update({
                where: { id: todoId, userId },
                data: {
                    status: status === "PENDING" ? "DONE" : "PENDING",
                    completedAt: status === "PENDING" ? new Date() : null,
                    updatedAt: new Date()
                },
            });
            return NextResponse.json(todo, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }



    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to delete todo" },
            { status: 500 }
        );
    }
}