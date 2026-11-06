import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, DocumentReviewData } from "@/types/admin";

export function useAdminDocuments(initialFilters: AdminFilters) {
  const [documents, setDocuments] = useState<DocumentReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const { data, count } = await adminApi.getDocuments(filters);
        setDocuments(data || []);
        setTotal(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    void loadDocuments();
  }, [filters]);

  const updateFilters = (newFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    documents,
    loading,
    error,
    filters,
    total,
    updateFilters,
  };
}