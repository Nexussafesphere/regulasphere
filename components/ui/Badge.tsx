import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "gold" | "outline" | "silver" | "success" | "warning" | "danger";
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = "outline",
  children,
  className,
}: BadgeProps) {
  const variantClasses = {
    gold: "badge badge-gold",
    outline: "badge badge-outline",
    silver: "badge badge-silver",
    success: "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium",
    warning: "bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium",
    danger: "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium",
  };

  return (
    <span className={cn(variantClasses[variant], className)}>{children}</span>
  );
}