import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/db";
import { ISubscription } from "@/types";
import { normalizeSubscriptionV2 } from "@/lib/helper";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await normalizeSubscriptionV2(userId);
  if (!subscription)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(subscription, { status: 200 });
}


