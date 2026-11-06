"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, UserCheck, Star, Briefcase } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ConsultantManagementData } from "@/types/admin";
import Link from "next/link";

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState<ConsultantManagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("all");

  const fetchConsultants = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.getConsultants({
        search: searchTerm,
        page: 1,
        limit: 100,
      });
      setConsultants(data || []);
    } catch (error) {
      console.error("Failed to fetch consultants:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    void Promise.resolve().then(fetchConsultants);
  }, [fetchConsultants]);

  const filteredConsultants = consultants.filter((consultant) => {
    if (filterVerified === "verified") return consultant.is_verified;
    if (filterVerified === "unverified") return !consultant.is_verified;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <UserCheck className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">Consultant Management</h2>
            <p className="text-sm text-muted mt-0.5">Manage consultant profiles and verifications</p>
          </div>
        </div>
        <Link href="/admin/consultants/verify" className="btn-primary">
          Verification Queue
        </Link>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search consultants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
          />
        </div>
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Consultants</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : filteredConsultants.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--army-green-pale)">
            <UserCheck className="h-6 w-6 text-muted" />
          </div>
          <p className="text-sm font-medium text-navy">No consultants found</p>
          <p className="mt-1 text-xs text-muted">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <div key={consultant.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-gradient text-navy flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-sm">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-navy truncate">{consultant.full_name}</h3>
                  <p className="text-sm text-muted truncate">{consultant.email}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  {consultant.specialization?.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Briefcase className="w-3.5 h-3.5" /> {consultant.years_experience} years experience
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Star className="w-3.5 h-3.5 text-gold" /> {consultant.rating?.toFixed(1)} (
                  {consultant.total_assignments || 0} assignments)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/consultants/${consultant.id}`} className="btn-secondary flex-1 py-2! text-xs!">
                  View Profile
                </Link>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                    consultant.is_verified
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                      : "bg-amber-50 text-amber-700 ring-amber-100"
                  }`}
                >
                  {consultant.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}