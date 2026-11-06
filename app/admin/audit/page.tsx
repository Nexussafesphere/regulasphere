"use client";

import { useState, useEffect } from "react";
import { ScrollText, Search, Download } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminAuditLog } from "@/types/admin";

export default function AdminAuditPage() {
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        const { data, count } = await adminApi.getAuditLogs(1, 100);
        setAuditLogs(data || []);
        setPagination((prev) => ({ ...prev, total: count || 0 }));
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      (log.admin_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entity_type || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === "all" || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const actions = Array.from(new Set(auditLogs.map((log) => log.action)));

  const handleExport = () => {
    const csvData = [
      ["Timestamp", "Admin", "Action", "Entity Type", "Entity Name", "Details"],
      ...filteredLogs.map((log) => [
        new Date(log.created_at).toISOString(),
        log.admin_email || "System",
        log.action,
        log.entity_type,
        log.entity_name || "",
        JSON.stringify(log.details),
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <ScrollText className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">Audit Logs</h2>
            <p className="text-sm text-muted mt-0.5">Track all administrative activities and changes</p>
          </div>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download className="w-4 h-4 inline mr-2" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <ScrollText className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No Audit Logs</h3>
          <p className="text-muted text-sm">Administrative activities will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFAF7] transition-colors">
                    <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-navy">{log.admin_email || "System"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{log.entity_type}</td>
                    <td className="px-6 py-4 text-sm text-muted">{log.entity_name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-muted max-w-xs truncate">{JSON.stringify(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination.total > pagination.limit && (
        <div className="card flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
          </p>
        </div>
      )}
    </div>
  );
}