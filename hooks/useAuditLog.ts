import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { AdminAuditLog } from "@/types/admin";

export function useAuditLog(initialPage: number = 1, initialLimit: number = 50) {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const { data, count } = await adminApi.getAuditLogs(page, limit);
        setLogs(data || []);
        setTotal(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, [page, limit]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

  return {
    logs,
    loading,
    error,
    page,
    limit,
    total,
    nextPage,
    prevPage,
    setLimit,
  };
}