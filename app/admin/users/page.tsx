"use client";

import { useState, useCallback, useEffect } from "react";
import UserTable from "@/components/admin/UserTable";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters } from "@/types/admin";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  user_type: "Business" | "Consultant" | "Regulator";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchUsers = useCallback(async (filters: AdminFilters) => {
    try {
      await Promise.resolve();
      setLoading(true);
      const { data, count } = await adminApi.getUsers(filters);
      setUsers(data || []);
      setPagination((prev) => ({ ...prev, total: count || 0 }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers({ search: "", page: 1, limit: 20 });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await adminApi.updateUserStatus(userId, isActive);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, is_active: isActive } : user))
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    void fetchUsers({ search: "", page, limit: pagination.limit });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <Users className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">User Management</h2>
          <p className="text-sm text-muted mt-0.5">Manage all platform users</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : (
        <UserTable users={users} onStatusChange={handleStatusChange} />
      )}

      {totalPages > 1 && (
        <div className="card flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-border hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-navy" />
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-navy">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-navy" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}