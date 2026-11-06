"use client";

import { useState, useCallback, useEffect } from "react";
import BusinessTable from "@/components/admin/BusinessTable";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, BusinessManagementData } from "@/types/admin";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchBusinesses = useCallback(async (filters: AdminFilters) => {
    try {
      setLoading(true);
      const { data, count } = await adminApi.getBusinesses(filters);
      setBusinesses(data || []);
      setPagination((prev) => ({ ...prev, total: count || 0 }));
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBusinesses({ search: "", page: 1, limit: 20 });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchBusinesses]);

  const handleVerify = async (businessId: string, approved: boolean) => {
    try {
      await adminApi.verifyBusiness(businessId, approved);
      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === businessId
            ? { ...business, verification_status: approved ? "verified" : "rejected" }
            : business
        )
      );
    } catch (error) {
      console.error("Failed to verify business:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    void fetchBusinesses({ search: "", page, limit: pagination.limit });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <Building2 className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Business Management</h2>
          <p className="text-sm text-muted mt-0.5">Manage and verify all registered businesses</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : (
        <BusinessTable businesses={businesses} onVerify={handleVerify} />
      )}

      {totalPages > 1 && (
        <div className="card flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} businesses
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-navy hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-navy">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-navy hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}