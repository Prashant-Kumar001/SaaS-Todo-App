import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { ISubscription } from "@/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = (await prisma.subscription.findUnique({
    where: { userId },
  })) as ISubscription | null;
  if (!subscription)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { plan } = await req.json();
  if (plan !== "Pro")
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); 

  const updated = (await prisma.subscription.update({
    where: { userId },
    data: {
      plan: "PRO",
      status: "ACTIVE",
      trialEndsAt: null,
      endDate,
      cancelAt: null,
      updatedAt: new Date(),
    },
  })) as ISubscription;

  return NextResponse.json(updated, { status: 200 });
}
