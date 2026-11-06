"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface FrameworkRiskScore {
  regulator: string;
  totalObligations: number;
  completed: number;
  overdue: number;
  pending: number;
  inProgress: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

export function useRiskScores(businessId: string) {
  const [scores, setScores] = useState<FrameworkRiskScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadScores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/risk-scores?businessId=${encodeURIComponent(businessId)}`);
      if (!res.ok) throw new Error("Failed to load risk scores");
      const { scores: data } = await res.json();
      setScores(data as FrameworkRiskScore[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load risk scores";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadScores();
    }
  }, [loadScores]);

  return { scores, loading, error, reload: loadScores };
}