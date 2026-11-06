"use client";

import { useState, useEffect } from "react";
import { Search, ClipboardList } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, ObligationManagementData } from "@/types/admin";

export default function AdminObligationsPage() {
  const [obligations, setObligations] = useState<ObligationManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegulator, setFilterRegulator] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadObligations = async () => {
      try {
        setLoading(true);
        const filters: AdminFilters = {
          search: searchTerm,
          page: 1,
          limit: 100,
        };
        if (filterRegulator !== "all") {
          filters.regulator = filterRegulator;
        }
        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }
        const { data } = await adminApi.getObligations(filters);
        setObligations(data || []);
      } catch (error) {
        console.error("Failed to fetch obligations:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadObligations();
  }, [searchTerm, filterRegulator, filterStatus]);

  const regulators = ["NDPC", "NITDA", "CAC", "NRS", "CBN", "SEC", "PENCOM", "ITF", "NSITF", "NAFDAC"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
      case "In Progress":
        return "bg-blue-50 text-blue-700 ring-blue-100";
      case "Overdue":
        return "bg-red-50 text-red-700 ring-red-100";
      case "Under Review":
        return "bg-purple-50 text-purple-700 ring-purple-100";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-50 text-red-700 ring-red-100";
      case "High":
        return "bg-orange-50 text-orange-700 ring-orange-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 ring-amber-100";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <ClipboardList className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Obligation Management</h2>
          <p className="text-sm text-muted mt-0.5">Monitor and manage compliance obligations</p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search obligations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
          />
        </div>
        <select
          value={filterRegulator}
          onChange={(e) => setFilterRegulator(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Regulators</option>
          {regulators.map((regulator) => (
            <option key={regulator} value={regulator}>
              {regulator}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
          <option value="Under Review">Under Review</option>
        </select>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : obligations.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <ClipboardList className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No obligations found</h3>
          <p className="text-muted text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Obligation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Regulator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {obligations.map((obligation) => (
                  <tr key={obligation.id} className="hover:bg-[#FAFAF7] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{obligation.title}</p>
                          {obligation.penalty && (
                            <p className="text-xs text-red-600">Penalty: {obligation.penalty}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{obligation.business_name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full">
                        {obligation.regulator}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{obligation.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getPriorityColor(obligation.priority)}`}
                      >
                        {obligation.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getStatusColor(obligation.status)}`}
                      >
                        {obligation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {obligation.deadline ? new Date(obligation.deadline).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}