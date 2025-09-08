import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "trialing":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="w-3 h-3" />,
          label: "Trial Active",
        };
      case "active":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Active",
        };
      case "canceled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertTriangle className="w-3 h-3" />,
          label: "Canceled",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <AlertTriangle className="w-3 h-3" />,
          label: status || "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${config.color}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
};

export default StatusBadge;