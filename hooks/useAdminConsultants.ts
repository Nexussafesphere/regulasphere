import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, ConsultantManagementData } from "@/types/admin";

export function useAdminConsultants(initialFilters: AdminFilters) {
  const [consultants, setConsultants] = useState<ConsultantManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const { data, count } = await adminApi.getConsultants(filters);
        setConsultants(data || []);
        setTotal(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load consultants");
      } finally {
        setLoading(false);
      }
    };

    void loadConsultants();
  }, [filters]);

  const updateFilters = (newFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    consultants,
    loading,
    error,
    filters,
    total,
    updateFilters,
  };
}