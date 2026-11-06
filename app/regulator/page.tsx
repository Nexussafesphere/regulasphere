"use client";

import { useState } from "react";

interface SectorData {
  sector: string;
  complianceRate: number;
}

interface ViolationData {
  category: string;
  count: number;
}

const sectorData: SectorData[] = [
  { sector: "Fintech", complianceRate: 45 },
  { sector: "Healthcare", complianceRate: 50 },
  { sector: "Manufacturing", complianceRate: 60 },
  { sector: "Agriculture", complianceRate: 35 },
  { sector: "Trading", complianceRate: 40 },
  { sector: "Technology", complianceRate: 55 },
];

const violationData: ViolationData[] = [
  { category: "Data Protection", count: 120 },
  { category: "Tax Filing", count: 85 },
  { category: "Pension", count: 45 },
  { category: "Licensing", count: 60 },
  { category: "Employment", count: 30 },
  { category: "AI Governance", count: 75 },
];

const watchlist = [
  { id: "BSN-001", sector: "Fintech", violation: "Unregistered VASP", regulator: "SEC", fine: "NGN 20M", status: "Under Investigation" },
  { id: "BSN-002", sector: "Healthcare", violation: "Data Breach", regulator: "NDPC", fine: "NGN 10M", status: "Notice Issued" },
  { id: "BSN-003", sector: "Fintech", violation: "AML Non-compliance", regulator: "CBN", fine: "NGN 5M", status: "Under Investigation" },
  { id: "BSN-004", sector: "Manufacturing", violation: "Product Registration", regulator: "NAFDAC", fine: "NGN 500K", status: "Resolved" },
];

export default function RegulatorPage() {
  const [view, setView] = useState<"overview" | "watchlist">("overview");

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="bg-navy text-white py-10 md:py-16 w-full">
        <div className="container max-w-full md:max-w-4xl px-4 w-full mx-auto">
          <h1 className="text-white mb-2 text-xl md:text-2xl">Regulatory Oversight Portal</h1>
          <p className="text-silver text-xs md:text-sm">Anonymized compliance intelligence from the RegulaSphere network.</p>
          <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
            <button onClick={() => setView("overview")} className={`btn btn-sm ${view === "overview" ? "btn-primary" : "btn-ghost"}`}>
              Overview
            </button>
            <button onClick={() => setView("watchlist")} className={`btn btn-sm ${view === "watchlist" ? "btn-primary" : "btn-ghost"}`}>
              Enforcement Watchlist
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 w-full">
        <div className="container max-w-full md:max-w-4xl px-4 w-full mx-auto">
          {view === "overview" ? (
            <div className="space-y-6 md:space-y-8 w-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full">
                <div className="card text-center py-4 md:py-6 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gold mb-1">500</p>
                  <p className="text-[10px] md:text-xs text-muted">Businesses Monitored</p>
                </div>
                <div className="card text-center py-4 md:py-6 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gold mb-1">62%</p>
                  <p className="text-[10px] md:text-xs text-muted">Overall Compliance</p>
                </div>
                <div className="card text-center py-4 md:py-6 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gold mb-1">38%</p>
                  <p className="text-[10px] md:text-xs text-muted">AI Governance Rate</p>
                </div>
                <div className="card text-center py-4 md:py-6 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gold mb-1">75%</p>
                  <p className="text-[10px] md:text-xs text-muted">CAC Compliance</p>
                </div>
              </div>

              <div className="card w-full">
                <h3 className="text-sm md:text-base mb-3 md:mb-4">Compliance by Sector</h3>
                <div className="space-y-2 md:space-y-3 w-full">
                  {sectorData.map((item) => (
                    <div key={item.sector}>
                      <div className="flex justify-between text-xs md:text-sm mb-1">
                        <span className="text-secondary">{item.sector}</span>
                        <span className="font-medium text-navy">{item.complianceRate}%</span>
                      </div>
                      <div className="h-2 bg-off-white rounded-full overflow-hidden">
                        <div className="h-full gold-gradient rounded-full transition-all" style={{ width: `${item.complianceRate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card w-full">
                <h3 className="text-sm md:text-base mb-3 md:mb-4">Common Violations</h3>
                <div className="space-y-2 md:space-y-3 w-full">
                  {violationData.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-xs md:text-sm mb-1">
                        <span className="text-secondary">{item.category}</span>
                        <span className="font-medium text-navy">{item.count} cases</span>
                      </div>
                      <div className="h-2 bg-off-white rounded-full overflow-hidden">
                        <div className="h-full silver-gradient rounded-full transition-all" style={{ width: `${(item.count / 120) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 w-full">
                <button className="btn btn-primary btn-sm">Download Anonymized Report</button>
                <button className="btn btn-secondary btn-sm">Export CSV</button>
              </div>
            </div>
          ) : (
            <div className="card w-full">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">Enforcement Watchlist</h3>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs md:text-sm min-w-150">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Business ID</th>
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Sector</th>
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Violation</th>
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Regulator</th>
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Potential Fine</th>
                      <th className="text-left py-3 px-2 text-xs uppercase tracking-wider text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-b-0">
                        <td className="py-3 px-2 font-medium text-navy">{item.id}</td>
                        <td className="py-3 px-2 text-secondary">{item.sector}</td>
                        <td className="py-3 px-2 text-secondary">{item.violation}</td>
                        <td className="py-3 px-2 text-secondary">{item.regulator}</td>
                        <td className="py-3 px-2 font-medium text-gold">{item.fine}</td>
                        <td className="py-3 px-2"><span className="badge badge-outline whitespace-nowrap">{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}