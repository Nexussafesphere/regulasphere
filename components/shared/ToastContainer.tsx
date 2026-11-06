"use client";

import { ToastProvider } from "@/components/ui/toast";
import { type ReactNode } from "react";

interface ToastContainerProps {
  children: ReactNode;
}

export default function ToastContainer({ children }: ToastContainerProps) {
  return <ToastProvider>{children}</ToastProvider>;
}