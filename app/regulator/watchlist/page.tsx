"use client";

import { useState } from "react";

interface WatchlistEntry {
  id: string;
  businessId: string;
  sector: string;
  violation: string;
  regulator: string;
  potentialFine: string;
  status: "Under Investigation" | "Notice Issued" | "Resolved" | "Escalated";
  dateDetected: string;
  complianceScore: number;
}

const watchlistData: WatchlistEntry[] = [
  {
    id: "1",
    businessId: "BSN-001",
    sector: "Fintech",
    violation: "Unregistered Virtual Asset Service Provider",
    regulator: "SEC",
    potentialFine: "NGN 20,000,000",
    status: "Under Investigation",
    dateDetected: "2026-08-15",
    complianceScore: 35,
  },
  {
    id: "2",
    businessId: "BSN-002",
    sector: "Healthcare",
    violation: "Data Breach - Failure to Notify",
    regulator: "NDPC",
    potentialFine: "NGN 10,000,000",
    status: "Notice Issued",
    dateDetected: "2026-08-10",
    complianceScore: 42,
  },
  {
    id: "3",
    businessId: "BSN-003",
    sector: "Fintech",
    violation: "AML/CFT Non-compliance",
    regulator: "CBN",
    potentialFine: "NGN 5,000,000",
    status: "Under Investigation",
    dateDetected: "2026-08-08",
    complianceScore: 38,
  },
  {
    id: "4",
    businessId: "BSN-004",
    sector: "Manufacturing",
    violation: "Unregistered Product",
    regulator: "NAFDAC",
    potentialFine: "NGN 500,000",
    status: "Resolved",
    dateDetected: "2026-07-28",
    complianceScore: 65,
  },
  {
    id: "5",
    businessId: "BSN-005",
    sector: "Fintech",
    violation: "AI Governance Framework Non-compliance",
    regulator: "NITDA",
    potentialFine: "NGN 30,000,000",
    status: "Escalated",
    dateDetected: "2026-08-01",
    complianceScore: 28,
  },
  {
    id: "6",
    businessId: "BSN-006",
    sector: "Technology",
    violation: "Data Protection Audit Not Filed",
    regulator: "NDPC",
    potentialFine: "NGN 10,000,000",
    status: "Under Investigation",
    dateDetected: "2026-08-12",
    complianceScore: 31,
  },
  {
    id: "7",
    businessId: "BSN-007",
    sector: "Trading",
    violation: "Late VAT Remittance",
    regulator: "NRS",
    potentialFine: "NGN 2,500,000",
    status: "Notice Issued",
    dateDetected: "2026-08-05",
    complianceScore: 52,
  },
  {
    id: "8",
    businessId: "BSN-008",
    sector: "Construction",
    violation: "Employee Compensation Non-compliance",
    regulator: "NSITF",
    potentialFine: "NGN 1,000,000",
    status: "Resolved",
    dateDetected: "2026-07-20",
    complianceScore: 71,
  },
];

const statusColors: Record<WatchlistEntry["status"], string> = {
  "Under Investigation": "badge badge-outline",
  "Notice Issued": "badge badge-gold",
  Resolved: "badge badge-silver",
  Escalated: "badge badge-gold",
};

export default function WatchlistPage() {
  const [filter, setFilter] = useState<"All" | WatchlistEntry["status"]>("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [regulatorFilter, setRegulatorFilter] = useState("All");

  const sectors = ["All", ...new Set(watchlistData.map((item) => item.sector))];
  const regulators = ["All", ...new Set(watchlistData.map((item) => item.regulator))];

  const filteredData = watchlistData.filter((item) => {
    const matchesStatus = filter === "All" || item.status === filter;
    const matchesSector = sectorFilter === "All" || item.sector === sectorFilter;
    const matchesRegulator = regulatorFilter === "All" || item.regulator === regulatorFilter;
    return matchesStatus && matchesSector && matchesRegulator;
  });

  const totalPotentialFines = filteredData.reduce((sum, item) => {
    const amount = parseInt(item.potentialFine.replace(/[^0-9]/g, ""));
    return sum + amount;
  }, 0);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="bg-navy text-white py-10 md:py-14 w-full">
        <div className="container max-w-full md:max-w-5xl px-4 w-full mx-auto">
          <h1 className="text-white mb-2 text-xl md:text-2xl">Enforcement Watchlist</h1>
          <p className="text-silver text-xs md:text-sm">
            Monitor businesses with potential compliance violations.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-10 w-full">
        <div className="container max-w-full md:max-w-5xl px-4 w-full mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8 w-full">
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">
                {filteredData.length}
              </p>
              <p className="text-[10px] md:text-xs text-muted">Total Cases</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">
                {filteredData.filter((i) => i.status === "Under Investigation").length}
              </p>
              <p className="text-[10px] md:text-xs text-muted">Under Investigation</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">
                {filteredData.filter((i) => i.status === "Escalated").length}
              </p>
              <p className="text-[10px] md:text-xs text-muted">Escalated</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full col-span-2 lg:col-span-1">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">
                NGN {(totalPotentialFines / 1000000).toFixed(1)}M
              </p>
              <p className="text-[10px] md:text-xs text-muted">Potential Fines</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6 w-full">
            <select
              className="select w-full sm:w-48 text-sm shrink-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "All" | WatchlistEntry["status"])}
            >
              <option value="All">All Statuses</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Notice Issued">Notice Issued</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              className="select w-full sm:w-48 text-sm shrink-0"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector === "All" ? "All Sectors" : sector}
                </option>
              ))}
            </select>

            <select
              className="select w-full sm:w-48 text-sm shrink-0"
              value={regulatorFilter}
              onChange={(e) => setRegulatorFilter(e.target.value)}
            >
              {regulators.map((regulator) => (
                <option key={regulator} value={regulator}>
                  {regulator === "All" ? "All Regulators" : regulator}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="card overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs md:text-sm min-w-200">
                <thead>
                  <tr className="border-b border-border bg-off-white">
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Business ID
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Sector
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold">
                      Violation
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Regulator
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Potential Fine
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Score
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 md:px-4 text-xs uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-b-0 hover:bg-off-white transition-colors"
                    >
                      <td className="py-3 px-3 md:px-4 font-medium text-navy whitespace-nowrap">
                        {item.businessId}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-secondary whitespace-nowrap">
                        {item.sector}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-secondary max-w-xs leading-relaxed">
                        {item.violation}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-secondary whitespace-nowrap">
                        {item.regulator}
                      </td>
                      <td className="py-3 px-3 md:px-4 font-medium text-gold whitespace-nowrap">
                        {item.potentialFine}
                      </td>
                      <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            item.complianceScore < 40
                              ? "text-red-500"
                              : item.complianceScore < 60
                              ? "text-amber-500"
                              : "text-green-600"
                          }`}
                        >
                          {item.complianceScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                        <span className={statusColors[item.status]}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-4 text-secondary text-xs whitespace-nowrap">
                        {item.dateDetected}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 w-full">
                <p className="text-sm text-muted">
                  No cases found matching the selected filters.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6 w-full">
            <button className="btn btn-primary btn-sm">Download Report</button>
            <button className="btn btn-secondary btn-sm">Export CSV</button>
          </div>
        </div>
      </section>
    </div>
  );
}