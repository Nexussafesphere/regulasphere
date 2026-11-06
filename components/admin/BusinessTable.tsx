"use client";

import { useState } from "react";
import { Building2, Search, MoreVertical, Eye, BadgeCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { BusinessManagementData } from "@/types/admin";

interface BusinessTableProps {
  businesses: BusinessManagementData[];
  onVerify?: (businessId: string, approved: boolean) => void;
}

export default function BusinessTable({ businesses, onVerify }: BusinessTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const sectors = Array.from(new Set(businesses.map((b) => b.sector)));

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === "all" || business.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-100";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    }
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold sm:w-auto"
          >
            <option value="all">All Sectors</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBusinesses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EAD9]">
            <Building2 className="h-6 w-6 text-muted" />
          </div>
          <p className="text-sm font-medium text-navy">No businesses found</p>
          <p className="mt-1 text-xs text-muted">
            {searchTerm || filterSector !== "all"
              ? "Try adjusting your search or filter."
              : "Businesses will appear here once registered."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  RC Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="transition-colors hover:bg-[#FAFAF7]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-gold/90 to-gold text-white shadow-sm">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy">{business.business_name}</p>
                        <p className="text-xs text-muted">TIN: {business.tin || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                      {business.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{business.rc_number || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-muted">{business.state || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-muted">{business.employee_count}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${getScoreColor(business.compliance_score)}`}>
                      {business.compliance_score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusBadge(
                        business.verification_status
                      )}`}
                    >
                      {business.verification_status}
                    </span>
                  </td>
                  <td className="relative px-6 py-4 text-right">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === business.id ? null : business.id)}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                      aria-label="Row actions"
                    >
                      <MoreVertical className="h-4 w-4 text-muted" />
                    </button>
                    {dropdownOpen === business.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(null)} />
                        <div className="absolute right-6 top-12 z-20 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                          <Link
                            href={`/admin/businesses/${business.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-navy hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </Link>
                          {business.verification_status !== "verified" && (
                            <button
                              onClick={() => {
                                onVerify?.(business.id, true);
                                setDropdownOpen(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-emerald-600 hover:bg-gray-50"
                            >
                              <BadgeCheck className="h-4 w-4" /> Verify Business
                            </button>
                          )}
                          {business.verification_status !== "rejected" && (
                            <button
                              onClick={() => {
                                onVerify?.(business.id, false);
                                setDropdownOpen(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                            >
                              <XCircle className="h-4 w-4" /> Reject Verification
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}