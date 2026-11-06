"use client";

import { useState, useEffect } from "react";
import { Landmark, Search, Shield, Activity } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters } from "@/types/admin";

interface RegulatorData {
  id: string;
  email: string;
  full_name: string;
  user_type: "Regulator";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function AdminRegulatorsPage() {
  const [regulators, setRegulators] = useState<RegulatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadRegulators = async () => {
      try {
        const filters: AdminFilters = { search: "", page: 1, limit: 100 };
        const { data } = await adminApi.getUsers(filters);
        const regulatorUsers = (data || []).filter((user: RegulatorData) => user.user_type === "Regulator");
        setRegulators(regulatorUsers);
      } catch (error) {
        console.error("Failed to fetch regulators:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadRegulators();
  }, []);

  const filteredRegulators = regulators.filter(
    (regulator) =>
      regulator.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <Landmark className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Regulator Management</h2>
          <p className="text-sm text-muted mt-0.5">Manage regulatory body accounts</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search regulators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
        />
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : filteredRegulators.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--army-green-pale)">
            <Landmark className="h-6 w-6 text-muted" />
          </div>
          <p className="text-sm font-medium text-navy">No regulators found</p>
          <p className="mt-1 text-xs text-muted">Regulator accounts will appear here once registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegulators.map((regulator) => (
            <div key={regulator.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-gradient text-navy flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-sm">
                  <Landmark className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-navy truncate">{regulator.full_name}</h3>
                  <p className="text-sm text-muted truncate">{regulator.email}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Shield className="w-4 h-4" />
                  <span>Regulatory Authority</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Activity className="w-4 h-4" />
                  <span>
                    Last active: {regulator.last_login ? new Date(regulator.last_login).toLocaleDateString() : "Never"}
                  </span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                  regulator.is_active
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                    : "bg-red-50 text-red-700 ring-red-100"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${regulator.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                {regulator.is_active ? "Active" : "Suspended"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}