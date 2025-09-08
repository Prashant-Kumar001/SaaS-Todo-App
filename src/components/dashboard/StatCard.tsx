import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Assuming you have this utility function

export function StatCard({
  title,
  value,
  hint,
  icon,
  className,
  variant = "default",
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "minimal" | "bordered";
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/60 shadow-lg";
      case "minimal":
        return "bg-white/80 backdrop-blur-sm border-slate-100 shadow-sm hover:shadow-md";
      case "bordered":
        return "bg-white border-2 border-slate-200 shadow-sm";
      default:
        return "bg-white border-slate-200/80 shadow-sm";
    }
  };

 
  return (
    <Card
      className={cn(
        "rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
        getVariantStyles(),
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
          {title}
        </CardTitle>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline justify-between">
          <div className=" font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
            {value.length > 25 ? value.substring(0, 25) + "..." : value}
          </div>
        </div>
        {hint && (
          <p className="mt-2 text-xs text-slate-500 group-hover:text-slate-600 transition-colors leading-relaxed">
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}


