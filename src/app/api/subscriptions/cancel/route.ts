import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { ISubscription } from "@/types";


export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  const subscriptionF = (await prisma.subscription.findUnique({
    where: { userId },
  })) as ISubscription | null;
  if (!subscriptionF)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (subscriptionF.status === "CANCELED")
    return NextResponse.json(
      { error: "Subscription already canceled" },
      { status: 400 }
    );

  const cancelAt = subscriptionF.endDate || new Date();

  const subscription = (await prisma.subscription.update({
    where: { userId },
    data: { status: "CANCELED", cancelAt, updatedAt: new Date() },
  })) as ISubscription;

  return NextResponse.json({subscription: subscription}, { status: 200 });
}
