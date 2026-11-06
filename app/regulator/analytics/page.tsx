"use client";

import { useState } from "react";

interface SectorData {
  sector: string;
  totalBusinesses: number;
  compliantBusinesses: number;
  avgScore: number;
}

interface ViolationData {
  category: string;
  count: number;
  percentage: number;
}

interface TrendData {
  month: string;
  avgScore: number;
}

const sectorData: SectorData[] = [
  { sector: "Fintech", totalBusinesses: 120, compliantBusinesses: 54, avgScore: 45 },
  { sector: "Healthcare", totalBusinesses: 80, compliantBusinesses: 40, avgScore: 50 },
  { sector: "Manufacturing", totalBusinesses: 95, compliantBusinesses: 57, avgScore: 60 },
  { sector: "Agriculture", totalBusinesses: 60, compliantBusinesses: 21, avgScore: 35 },
  { sector: "Trading", totalBusinesses: 85, compliantBusinesses: 34, avgScore: 40 },
  { sector: "Technology", totalBusinesses: 60, compliantBusinesses: 33, avgScore: 55 },
];

const violationData: ViolationData[] = [
  { category: "Data Protection", count: 120, percentage: 29 },
  { category: "Tax Filing", count: 85, percentage: 20 },
  { category: "AI Governance", count: 75, percentage: 18 },
  { category: "Licensing", count: 60, percentage: 14 },
  { category: "Pension", count: 45, percentage: 11 },
  { category: "Employment", count: 30, percentage: 8 },
];

const trendData: TrendData[] = [
  { month: "Mar 2026", avgScore: 48 },
  { month: "Apr 2026", avgScore: 52 },
  { month: "May 2026", avgScore: 55 },
  { month: "Jun 2026", avgScore: 58 },
  { month: "Jul 2026", avgScore: 60 },
  { month: "Aug 2026", avgScore: 62 },
];

export default function AnalyticsPage() {
  const [selectedSector, setSelectedSector] = useState("All");

  const filteredSectorData =
    selectedSector === "All"
      ? sectorData
      : sectorData.filter((s) => s.sector === selectedSector);

  const totalBusinesses = sectorData.reduce(
    (sum, s) => sum + s.totalBusinesses,
    0
  );
  const totalCompliant = sectorData.reduce(
    (sum, s) => sum + s.compliantBusinesses,
    0
  );
  const overallRate = Math.round((totalCompliant / totalBusinesses) * 100);
  const totalViolations = violationData.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="bg-navy text-white py-10 md:py-14 w-full">
        <div className="container max-w-full md:max-w-5xl px-4 w-full mx-auto">
          <h1 className="text-white mb-2 text-xl md:text-2xl">Compliance Analytics</h1>
          <p className="text-silver text-xs md:text-sm">
            National compliance intelligence from the RegulaSphere network.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-10 w-full">
        <div className="container max-w-full md:max-w-5xl px-4 w-full mx-auto space-y-6 md:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full">
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">{totalBusinesses}</p>
              <p className="text-[10px] md:text-xs text-muted">Total Businesses</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">{overallRate}%</p>
              <p className="text-[10px] md:text-xs text-muted">Overall Compliance</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">{totalViolations}</p>
              <p className="text-[10px] md:text-xs text-muted">Total Violations</p>
            </div>
            <div className="card text-center py-4 md:py-6 w-full col-span-2 lg:col-span-1">
              <p className="text-lg md:text-2xl font-bold text-gold mb-1">38%</p>
              <p className="text-[10px] md:text-xs text-muted">AI Governance Rate</p>
            </div>
          </div>

          {/* Sector & Violations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full">
            <div className="card w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 md:mb-4">
                <h3 className="text-sm md:text-base">Compliance by Sector</h3>
                <select
                  className="select w-full sm:w-40 text-sm"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <option value="All">All Sectors</option>
                  {sectorData.map((s) => (
                    <option key={s.sector} value={s.sector}>
                      {s.sector}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 md:space-y-4 w-full">
                {filteredSectorData.map((item) => (
                  <div key={item.sector}>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span className="text-secondary">{item.sector}</span>
                      <span className="font-medium text-navy">
                        {item.avgScore}% ({item.compliantBusinesses}/{item.totalBusinesses})
                      </span>
                    </div>
                    <div className="h-2 md:h-2.5 bg-off-white rounded-full overflow-hidden">
                      <div
                        className="h-full gold-gradient rounded-full transition-all duration-500"
                        style={{ width: `${item.avgScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card w-full">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">Common Violations</h3>
              <div className="space-y-3 md:space-y-4 w-full">
                {violationData.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span className="text-secondary">{item.category}</span>
                      <span className="font-medium text-navy">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 md:h-2.5 bg-off-white rounded-full overflow-hidden">
                      <div
                        className="h-full silver-gradient rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage * 3}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="card w-full">
            <h3 className="text-sm md:text-base mb-4 md:mb-6">Compliance Trend (6 Months)</h3>
            <div className="flex items-end gap-2 md:gap-4 h-40 md:h-48 w-full">
              {trendData.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1 md:gap-2 min-w-0">
                  <span className="text-[10px] md:text-xs font-medium text-navy">{item.avgScore}%</span>
                  <div
                    className="w-full gold-gradient rounded-t-lg transition-all duration-500"
                    style={{ height: `${item.avgScore * 1.5}px` }}
                  />
                  <span className="text-[8px] md:text-xs text-muted truncate">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regulators & Consultants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full">
            <div className="card w-full">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">Top Regulators by Activity</h3>
              <div className="space-y-2 md:space-y-3 w-full">
                {[
                  { name: "NDPC", cases: 120, color: "bg-purple-500" },
                  { name: "NRS", cases: 85, color: "bg-blue-500" },
                  { name: "NITDA", cases: 75, color: "bg-teal-500" },
                  { name: "CBN", cases: 60, color: "bg-red-500" },
                  { name: "SEC", cases: 55, color: "bg-orange-500" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2 md:gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs md:text-sm text-secondary flex-1 truncate">{item.name}</span>
                    <span className="text-xs md:text-sm font-medium text-navy shrink-0">{item.cases} cases</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card w-full">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">Consultant Performance</h3>
              <div className="space-y-1 md:space-y-2 w-full">
                {[
                  { name: "Dr. Amina Ibrahim", verifications: 45, time: "2.1 days" },
                  { name: "Barrister Emeka Okafor", verifications: 38, time: "1.8 days" },
                  { name: "Dr. Chioma Eze", verifications: 32, time: "2.4 days" },
                  { name: "Mrs. Funke Adeyemi", verifications: 28, time: "2.0 days" },
                  { name: "Mr. Yusuf Bello", verifications: 25, time: "2.3 days" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-border last:border-b-0"
                  >
                    <span className="text-xs md:text-sm text-secondary truncate">{item.name}</span>
                    <span className="text-xs md:text-sm font-medium text-navy shrink-0">
                      {item.verifications} | {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3 w-full">
            <button className="btn btn-primary btn-sm">Download Full Report</button>
            <button className="btn btn-secondary btn-sm">Export CSV</button>
            <button className="btn btn-secondary btn-sm">Print</button>
          </div>
        </div>
      </section>
    </div>
  );
}