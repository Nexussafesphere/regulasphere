"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface Client {
  id: string;
  business_name: string;
  sector: string;
  compliance_score: number;
  assigned_obligations: number;
  pending_documents: number;
  completed_obligations: number;
  overdue_obligations: number;
}

const CLIENTS: Client[] = [
  {
    id: "b1",
    business_name: "Lagos Fintech Solutions",
    sector: "Fintech",
    compliance_score: 68,
    assigned_obligations: 5,
    pending_documents: 2,
    completed_obligations: 3,
    overdue_obligations: 2,
  },
  {
    id: "b2",
    business_name: "Abuja Health Plus",
    sector: "Healthcare",
    compliance_score: 55,
    assigned_obligations: 3,
    pending_documents: 1,
    completed_obligations: 1,
    overdue_obligations: 1,
  },
  {
    id: "b3",
    business_name: "Kano Manufacturing Co",
    sector: "Manufacturing",
    compliance_score: 72,
    assigned_obligations: 4,
    pending_documents: 0,
    completed_obligations: 3,
    overdue_obligations: 0,
  },
  {
    id: "b4",
    business_name: "Port Harcourt Traders Ltd",
    sector: "Trading",
    compliance_score: 45,
    assigned_obligations: 2,
    pending_documents: 3,
    completed_obligations: 0,
    overdue_obligations: 1,
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const SECTORS = [
    "All",
    "Fintech",
    "Healthcare",
    "Manufacturing",
    "Trading",
    "Technology",
    "Agriculture",
  ];

  const filtered = CLIENTS.filter((client) => {
    const matchesSearch = client.business_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSector =
      sectorFilter === "All" || client.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/consultant"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Consultant Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              My Clients
            </h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 w-full">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients..."
              className="input pl-10 w-full text-sm"
            />
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="select w-full sm:w-44 text-sm shrink-0"
          >
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
          {filtered.map((client) => (
            <div key={client.id} className="card w-full">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-navy truncate">
                    {client.business_name}
                  </h3>
                  <p className="text-xs text-muted">{client.sector}</p>
                </div>
                <span
                  className={`text-lg md:text-xl font-bold ${getScoreColor(
                    client.compliance_score
                  )} shrink-0`}
                >
                  {client.compliance_score}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 md:mb-4 w-full">
                <div className="text-center py-2 bg-off-white rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1 shrink-0" />
                  <p className="text-xs font-medium text-navy">
                    {client.completed_obligations}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted">Completed</p>
                </div>
                <div className="text-center py-2 bg-off-white rounded">
                  <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1 shrink-0" />
                  <p className="text-xs font-medium text-navy">
                    {client.assigned_obligations}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted">Active</p>
                </div>
                <div className="text-center py-2 bg-off-white rounded">
                  <XCircle className="w-4 h-4 text-red-500 mx-auto mb-1 shrink-0" />
                  <p className="text-xs font-medium text-navy">
                    {client.overdue_obligations}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted">Overdue</p>
                </div>
              </div>

              <Link
                href={`/consultant/clients/${client.id}`}
                className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
              >
                View Details <ChevronRight className="w-3 h-3 shrink-0" />
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-12 w-full">
              <Users className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No clients found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}