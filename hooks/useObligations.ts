"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ObligationItem {
  id: string;
  title: string;
  regulator: string;
  status: string;
  category?: string;
  priority?: string;
  deadline?: string;
}

export function useObligations(businessId: string) {
  const [obligations, setObligations] = useState<ObligationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadObligations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/obligations?businessId=${encodeURIComponent(businessId)}`);
      if (!res.ok) throw new Error("Failed to load obligations");
      const { obligations: data } = await res.json();
      setObligations(data as ObligationItem[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load obligations";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadObligations();
    }
  }, [loadObligations]);

  return { obligations, loading, error, reload: loadObligations };
}