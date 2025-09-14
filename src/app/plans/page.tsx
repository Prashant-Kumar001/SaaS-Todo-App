"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setDashboardData } from "@/lib/store/slices/meSlice";
import { userClient } from "@/lib/userClient";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingOverlay from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    features: ["Up to 10 todos", "Basic support", "1 user"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹299/mo",
    features: ["Unlimited todos", "Priority support", "Multiple devices"],
  },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handlePlanSelection = async () => {
    if (!selectedPlan || selectedPlan === "free") return;

    try {
      setLoading(true);
      setError("");

     
      const res = await userClient.upgradePlan(
        plans.find((plan) => plan.id === selectedPlan)?.name || ""
      );

      if (res.success) {
        dispatch(setDashboardData(res.data));
        toast.success("Plan upgraded successfully");
        router.push("/overview");
      } 

      if (res.error) {
        throw new Error(res.error ?? "Failed to upgrade plan");
      }

    } catch (err: any) {
      setError(err.message || "Failed to upgrade plan");
      toast.error("Failed to upgrade plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <Alert variant="destructive" role="alert" aria-live="polite">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <LoadingOverlay isLoading={loading} />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Choose Your Plan
        </h1>
        <p className="mt-3 text-gray-600">
          Select the best plan for your needs and unlock more features.
        </p>
      </div>

      
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`cursor-pointer rounded-2xl border-2 p-6 transition hover:scale-[1.02] bg-white ${
              selectedPlan === plan.id
                ? "border-blue-600 shadow-lg"
                : "border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold mt-1">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-gray-600 text-sm">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={() => setSelectedPlan(null)}>
          Cancel
        </Button>
        <Button
          disabled={!selectedPlan || selectedPlan === "free" || loading}
          onClick={handlePlanSelection}
        >
          {selectedPlan && selectedPlan !== "free"
            ? `Upgrade to ${selectedPlan}`
            : "Choose a plan"}
        </Button>
      </div>
    </div>
  );
}
