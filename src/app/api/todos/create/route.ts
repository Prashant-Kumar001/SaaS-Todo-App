import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/db";

export async function checkUserPermissions(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      status: true,
      plan: true,
      trialEndsAt: true,
      endDate: true,
      cancelAt: true,
    },
  });

  if (!subscription) return { canCreateTodo: false, plan: "FREE" };


  

  let TODO_LIMIT: Record<string, number> = {
    FREE: 10,
    PRO: 100,
  };
  

  const now = new Date();

  const isExpired =
    (subscription.status === "TRIALING" &&
      subscription.trialEndsAt &&
      subscription.trialEndsAt < now) ||
    (subscription.status === "ACTIVE" &&
      subscription.endDate &&
      subscription.endDate < now) ||
    (subscription.status === "CANCELED" &&
      subscription.cancelAt &&
      subscription.cancelAt < now) ||
    subscription.status === "EXPIRED";


  const effectivePlan = isExpired ? "FREE" : subscription.plan;

  return {
    canCreateTodo: true, 
    plan: effectivePlan,
    isExpired,
    needsUpgrade: effectivePlan === "FREE",
    TODO_LIMIT: subscription.trialEndsAt ? 10 : TODO_LIMIT[effectivePlan],
    mode: subscription.trialEndsAt ? "trial" : "paid",
    planStatus: subscription.status

  };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();
    if (!title || !title.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const subscription = await checkUserPermissions(userId);

    const todoCount = await prisma.todo.count({ where: { userId } });
    const status = subscription?.TODO_LIMIT ?? 0;

    if (todoCount >= status) {
      return NextResponse.json(
        { error: `Todo limit reached (${status}) for your plan. you have to upgrade your plan to create more todos ` },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: { title: title.trim(), description, userId },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
