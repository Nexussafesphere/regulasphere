// hooks/useDashboard.ts — replaced to call the API route instead of admin functions directly
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DashboardData {
  business: unknown;
  obligations: unknown[];
  documents: unknown[];
  alerts: unknown[];
  risk: unknown;
  activities: unknown[];
  complianceScore: number;
}

export function useDashboard(businessId: string) {
  const [data, setData] = useState<DashboardData>({
    business: null, obligations: [], documents: [], alerts: [],
    risk: null, activities: [], complianceScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/dashboard?businessId=${encodeURIComponent(businessId)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load dashboard");
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadDashboard();
    }
  }, [loadDashboard]);

  return { data, loading, error, reload: loadDashboard };
}