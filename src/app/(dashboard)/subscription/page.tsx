"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  CreditCard,
  Clock,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/statusBadge";
import PlanBadge from "@/components/dashboard/PlanBadge";
import InfoCard from "@/components/dashboard/InfoCard";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { userClient } from "@/lib/userClient";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { subscription } = useSelector((state: RootState) => state.dashboard);

  const handlerCancelSubscription = async () => {
    try {
      setLoading(true);
      const res = await userClient.cancelPlan();
      if (res.success) {
        toast.success("Subscription cancelled successfully");
        window.location.reload();
      }
      if (res.error) {
        throw new Error(res.error ?? "Failed to cancel subscription");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <Alert className="rounded-xl border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          No subscription found. Please contact support if this seems incorrect.
        </AlertDescription>
      </Alert>
    );
  }

  
  const trialEndsAt = subscription.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;
  const isTrialEnding =
    trialEndsAt && trialEndsAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
  const trialDaysRemaining = trialEndsAt
    ? Math.max(
        0,
        Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 0;

 
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
  const cancelDate = subscription.cancelAt
    ? new Date(subscription.cancelAt)
    : null;

  
  const isExpiringSoon =
    endDate && endDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  
  const getAlert = () => {
    if (subscription.status === "TRIALING" && isTrialEnding) {
      return (
        <Alert className="rounded-xl border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Your trial expires in {trialDaysRemaining} day
            {trialDaysRemaining !== 1 ? "s" : ""}. Upgrade now to continue
            enjoying all features.
          </AlertDescription>
        </Alert>
      );
    }

    if (subscription.status === "EXPIRED") {
      return (
        <Alert className="rounded-xl border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Your subscription has expired. Subscribe to a plan to continue using
            all features.
          </AlertDescription>
        </Alert>
      );
    }

    if (subscription.status === "CANCELED") {
      return (
        <Alert className="rounded-xl border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Your subscription has been cancelled and will end on{" "}
            {endDate?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            . You can reactivate anytime.
          </AlertDescription>
        </Alert>
      );
    }

    if (subscription.status === "ACTIVE" && isExpiringSoon) {
      return (
        <Alert className="rounded-xl border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Your subscription expires soon. Make sure your payment method is up
            to date.
          </AlertDescription>
        </Alert>
      );
    }

    if (subscription.status === "ACTIVE") {
      return (
        <Alert className="rounded-xl border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your subscription is active and all features are available.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const getSubscriptionDescription = () => {
    switch (subscription.status) {
      case "TRIALING":
        return `You're currently on a free trial of our ${subscription.plan} plan`;
      case "ACTIVE":
        return `You're subscribed to the ${subscription.plan} plan`;
      case "EXPIRED":
        return `Your subscription has expired`;
      case "CANCELED":
        return `Your ${subscription.plan} subscription is cancelled`;
      default:
        return `You have a ${subscription.plan} plan`;
    }
  };

  const getBillingStatus = () => {
    switch (subscription.status) {
      case "TRIALING":
        return "No charges during trial";
      case "ACTIVE":
        return "Active billing";
      case "EXPIRED":
        return "Billing expired";
      case "CANCELED":
        return cancelDate ? "Cancelled" : "Billing cancelled";
      default:
        return "Unknown";
    }
  };

  const getNextBilling = () => {
    if (subscription.status === "TRIALING") {
      return trialEndsAt ? "After trial ends" : "Not scheduled";
    }

    if (subscription.status === "ACTIVE") {
      return endDate
        ? endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Contact support";
    }

    if (subscription.status === "CANCELED") {
      return endDate
        ? `Service ends ${endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`
        : "Not scheduled";
    }

    return "Not scheduled";
  };

  const getActionButtons = () => {
    if (subscription.status === "TRIALING") {
      return (
        <Button
          size="sm"
          onClick={() => router.push("/plans")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Upgrade Now
        </Button>
      );
    }

    if (subscription.status === "ACTIVE") {
      return (
        <div className="w-full flex flex-col items-center justify-center sm:flex-row gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/plans")}
          >
            Change Plan
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handlerCancelSubscription}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Cancel Subscription
          </Button>
        </div>
      );
    }

    if (
      subscription.status === "EXPIRED" ||
      subscription.status === "CANCELED"
    ) {
      return (
        <Button
          size="sm"
          onClick={() => router.push("/plans")}
          className="bg-green-600 hover:bg-green-700"
        >
          {subscription.status === "CANCELED" ? "Reactivate" : "Subscribe"}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Your Subscription</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your subscription plan and billing information
        </p>
      </div>

      <Separator />

      {getAlert()}

      <Card className="rounded-2xl border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Current Plan
            </CardTitle>
            <StatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-6">
            <PlanBadge plan={subscription.plan} status={subscription.status} />
            <p className="text-gray-600 mt-3">{getSubscriptionDescription()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={<Clock className="w-5 h-5" />}
              label="Subscription Created"
            >
              <div className="font-medium text-slate-700 text-sm">
                {new Date(subscription.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </InfoCard>

            {subscription.status === "TRIALING" && trialEndsAt && (
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Trial Ends"
                className={isTrialEnding ? "border-amber-200 bg-amber-50" : ""}
              >
                <div className="space-y-1">
                  <div className="font-medium text-slate-700">
                    {trialEndsAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div
                    className={`text-sm ${
                      isTrialEnding
                        ? "text-amber-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {trialDaysRemaining} day
                    {trialDaysRemaining !== 1 ? "s" : ""} remaining
                  </div>
                </div>
              </InfoCard>
            )}

            <InfoCard
              icon={<CreditCard className="w-5 h-5" />}
              label="Billing Status"
            >
              <div className="font-medium text-slate-700">
                {getBillingStatus()}
              </div>
            </InfoCard>

            <InfoCard
              icon={<Calendar className="w-5 h-5" />}
              label={
                subscription.status === "CANCELED"
                  ? "Service Ends"
                  : "Next Billing"
              }
            >
              <div className="font-medium text-slate-700">
                {getNextBilling()}
              </div>
            </InfoCard>
          </div>

          <div className="flex justify-center items-center pt-6 border-t border-gray-100">
            {getActionButtons()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
