import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div className={cn("admin-stat-card card flex flex-col justify-between min-h-35", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="admin-stat-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-bold",
              trend === "up" && "bg-emerald-50 text-emerald-700",
              trend === "down" && "bg-red-50 text-red-700",
              trend === "neutral" && "bg-off-white text-secondary"
            )}
          >
            {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="min-h-7 text-[11px] font-bold uppercase leading-4 tracking-normal text-muted line-clamp-2">{title}</h3>
        <p className="mt-1 text-2xl font-bold tracking-normal text-navy truncate">{value}</p>
        {changeLabel && <p className="mt-1 text-xs text-muted truncate">{changeLabel}</p>}
      </div>
    </div>
  );
}