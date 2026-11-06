"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Obligation {
  id: string;
  business_id: string;
  title: string;
  regulator: string;
  description?: string;
  legal_basis?: string;
  deadline?: string;
  penalty?: string;
  category?: string;
  priority?: string;
  status: string;
  remediation_steps?: string[];
  ai_notes?: string;
  assigned_consultant_id?: string;
}

const CATEGORIES = [
  "All",
  "CAC",
  "Data Protection",
  "AI Governance",
  "Tax",
  "Licensing",
  "Pension",
  "Employment",
];

const STATUS_FILTERS = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Overdue",
  "Under Review",
];

export default function ObligationsPage() {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const hasLoaded = useRef(false);

  const [businessId, setBusinessId] = useState<string | null>(null);

  const loadObligations = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);

      let currentBusinessId = businessId;
      if (!currentBusinessId) {
        const bizRes = await fetch("/api/businesses");
        if (!bizRes.ok) throw new Error("Failed to resolve business");
        const { business } = await bizRes.json();
        if (!business) throw new Error("No business profile found");
        currentBusinessId = business.id;
        setBusinessId(business.id);
      }

      if (!currentBusinessId) {
        throw new Error("No business ID available");
      }

      const res = await fetch(`/api/obligations?businessId=${encodeURIComponent(currentBusinessId)}`);
      if (!res.ok) throw new Error("Failed to fetch obligations");
      const { obligations: data } = await res.json();
      setObligations(data as Obligation[]);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load obligations");
      setObligations([]);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadObligations();
    }
  }, [loadObligations]);

  const filtered = obligations.filter((ob) => {
    const matchesCategory =
      categoryFilter === "All" || ob.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || ob.status === statusFilter;
    const matchesSearch = ob.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
      case "Overdue":
        return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
      case "Under Review":
        return <AlertTriangle className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-muted shrink-0" />;
    }
  };

  const getPriorityBadge = (priority: string | undefined) => {
    switch (priority) {
      case "Critical":
        return "badge badge-gold";
      case "High":
        return "badge badge-outline";
      default:
        return "badge badge-silver";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading obligations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              Compliance Obligations
            </h1>
          </div>
          <button
            onClick={loadObligations}
            className="btn btn-secondary btn-sm self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3 h-3 shrink-0" /> Refresh
          </button>
        </div>

        {loadError && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{loadError}</span>
            <button type="button" onClick={loadObligations} className="underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 w-full">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search obligations..."
              className="input pl-10 w-full text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select flex-1 sm:w-40 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select flex-1 sm:w-36 text-sm"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 w-full">
          {filtered.map((ob) => (
            <div key={ob.id} className="card w-full">
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {ob.title}
                    </h3>
                    <span className={`${getPriorityBadge(ob.priority)} shrink-0`}>
                      {ob.priority || "Medium"}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {ob.regulator} | {ob.category || "General"} | Due:{" "}
                    {ob.deadline || "N/A"}
                  </p>
                  {ob.legal_basis && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Legal Basis: {ob.legal_basis}
                    </p>
                  )}
                  {ob.penalty && (
                    <p className="text-xs text-red-500 mt-1 leading-relaxed">
                      Penalty: {ob.penalty}
                    </p>
                  )}
                  {ob.remediation_steps && ob.remediation_steps.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-navy mb-1">
                        Remediation Steps:
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5">
                        {ob.remediation_steps.map((step, i) => (
                          <li key={i} className="text-xs text-secondary leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  {getStatusIcon(ob.status)}
                  <span className="text-xs font-medium text-navy truncate">
                    {ob.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loadError && (
            <div className="text-center py-12 w-full">
              <Filter className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">
                No obligations match your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}