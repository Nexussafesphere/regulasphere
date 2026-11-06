import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, BusinessManagementData } from "@/types/admin";

export function useAdminBusinesses(initialFilters: AdminFilters) {
  const [businesses, setBusinesses] = useState<BusinessManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        const { data, count } = await adminApi.getBusinesses(filters);
        setBusinesses(data || []);
        setTotal(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    void loadBusinesses();
  }, [filters]);

  const updateFilters = (newFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    businesses,
    loading,
    error,
    filters,
    total,
    updateFilters,
  };
}