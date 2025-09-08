import { StatusType } from "@/types";
import { Crown } from "lucide-react";

const PlanBadge = ({ plan, status }: { plan: string; status: StatusType }) => {
  const isPro = plan?.toLowerCase() === "pro";
  const isTrial = status === "TRIALING";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm ${
          isPro
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {isPro && <Crown className="w-4 h-4" />}
        {plan}
      </div>
      {isTrial && (
        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
          Trial
        </span>
      )}
    </div>
  );
};

export default PlanBadge;