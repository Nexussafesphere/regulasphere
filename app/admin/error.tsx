"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="card text-center py-16">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-navy mb-2">Something went wrong</h2>
      <p className="text-muted text-sm mb-6">An error occurred while loading the admin panel.</p>
      <button onClick={reset} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}