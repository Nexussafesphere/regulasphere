import { useState, useEffect } from "react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters } from "@/types/admin";

export function useAdminUsers(initialFilters: AdminFilters) {
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const { data, count } = await adminApi.getUsers(filters);
        setUsers(data || []);
        setTotal(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, [filters]);

  const updateFilters = (newFilters: Partial<AdminFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    users,
    loading,
    error,
    filters,
    total,
    updateFilters,
  };
}