import { prisma } from "@/lib/db";
import { ISubscription } from "@/types";

export async function normalizeSubscription(
  userId: string
): Promise<ISubscription> {
  let subscription = (await prisma.subscription.findUnique({
    where: { userId },
  })) as ISubscription | null;

  if (!subscription) throw new Error("Subscription not found");

  const now = new Date();
  let updateData: Partial<ISubscription> = {};

  // Handle different status transitions
  switch (subscription.status) {
    case "TRIALING":
      // Trial has expired
      if (subscription.trialEndsAt && subscription.trialEndsAt < now) {
        updateData = {
          plan: "FREE",
          status: "EXPIRED", // Mark as expired first
          trialEndsAt: null,
        };
      }
      break;

    case "ACTIVE":
      // Active PRO subscription has expired
      if (
        subscription.plan === "PRO" &&
        subscription.endDate &&
        subscription.endDate < now
      ) {
        updateData = {
          plan: "FREE",
          status: "EXPIRED",
          endDate: null,
        };
      }
      break;

    case "CANCELED":
      // Cancelled subscription period has ended
      if (subscription.cancelAt && subscription.cancelAt < now) {
        updateData = {
          plan: "FREE",
          status: "EXPIRED", // Set to expired, not active
          cancelAt: null,
          endDate: null,
          trialEndsAt: null,
        };
      }
      break;

    case "EXPIRED":
      // Expired subscriptions stay expired until user takes action
      // No automatic changes needed here
      break;

    default:
      console.warn(`Unknown subscription status: ${subscription.status}`);
  }

  // Apply updates if any
  if (Object.keys(updateData).length > 0) {
    subscription = (await prisma.subscription.update({
      where: { userId },
      data: {
        ...updateData,
        updatedAt: now, // Always update the timestamp
      },
    })) as ISubscription;
  }

  return subscription;
}

export async function normalizeSubscriptionV2(
  userId: string
): Promise<ISubscription> {
  let subscription = (await prisma.subscription.findUnique({
    where: { userId },
  })) as ISubscription | null;

  if (!subscription) throw new Error("Subscription not found");

  const now = new Date();
  let needsUpdate = false;
  const updates: Partial<ISubscription> = {};

  if (subscription.status === "TRIALING") {
    if (subscription.trialEndsAt && subscription.trialEndsAt <= now) {
      updates.status = "EXPIRED";
      updates.plan = "FREE";
      updates.trialEndsAt = null;
      needsUpdate = true;
    }
  }

  else if (subscription.status === "ACTIVE") {
    if (subscription.endDate && subscription.endDate <= now) {
      updates.status = "EXPIRED";
      updates.plan = "FREE";
      updates.endDate = null;
      needsUpdate = true;
    }
  }

  else if (subscription.status === "CANCELED") {
    if (subscription.cancelAt && subscription.cancelAt <= now) {
      updates.status = "EXPIRED";
      updates.plan = "FREE";
      updates.cancelAt = null;
      updates.endDate = null;
      updates.trialEndsAt = null;
      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    subscription = (await prisma.subscription.update({
      where: { userId },
      data: {
        ...updates,
        updatedAt: now,
      },
    })) as ISubscription;
  }

  return subscription;
}

// Usage recommendation: Call this function:
// 1. Before displaying subscription info to user
// 2. Before checking user permissions/access
// 3. In a background job (cron) to clean up expired subscriptions
// 4. When user tries to access premium features

