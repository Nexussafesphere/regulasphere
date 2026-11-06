import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export default function Card({
  children,
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("card", hoverable && "hover:border-gold", className)}
      {...props}
    >
      {children}
    </div>
  );
}