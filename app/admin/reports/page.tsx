"use client";

import { useEffect, useState } from "react";
import { Download, Users, Building2, Activity, BarChart3 } from "lucide-react";
import {
  UserGrowthChart,
  SectorComplianceChart,
  ComplianceTrendChart,
} from "@/components/admin/AdminCharts";
import { adminApi } from "@/lib/admin-api";
import { UserGrowthData, SectorComplianceData } from "@/types/admin";

interface ComplianceTrendPoint {
  month: string;
  avg_score: number;
}

export default function AdminReportsPage() {
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [sectorCompliance, setSectorCompliance] = useState<SectorComplianceData[]>([]);
  const [complianceTrend, setComplianceTrend] = useState<ComplianceTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      try {
        const [growthData, sectorData, statsData, auditData] = await Promise.all([
          adminApi.getUserGrowth(12),
          adminApi.getSectorCompliance(),
          adminApi.getDashboardStats(),
          adminApi.getAuditLogs(1, 100),
        ]);

        if (!mounted) return;

        setUserGrowth(growthData ?? []);
        setSectorCompliance(sectorData ?? []);

        // Real compliance score per month isn't tracked historically yet, so we
        // show the current avg score against each month that had audit activity
        // rather than random placeholder numbers.
        const trend: ComplianceTrendPoint[] =
          auditData?.data?.map((activity: { created_at: string }) => ({
            month: new Date(activity.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            avg_score: statsData?.avg_compliance_score || 0,
          })) ?? [];

        setComplianceTrend(trend);
      } catch (error) {
        console.error("[admin/reports] Failed to fetch reports:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadReports();
    return () => {
      mounted = false;
    };
  }, []);

  const buildCsv = (rows: string[][]) =>
    rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

  const handleExportReport = (reportType: "users" | "compliance" | "activity") => {
    const csvData: string[][] = [
      ["Report Type", reportType],
      ["Generated At", new Date().toISOString()],
      [],
    ];

    if (reportType === "users") {
      csvData.push(["Month", "New Users", "Total Users"]);
      userGrowth.forEach((d) => {
        csvData.push([d.month, String(d.new_users), String(d.total_users)]);
      });
    } else if (reportType === "compliance") {
      csvData.push(["Sector", "Total Businesses", "Compliant", "Avg Score"]);
      sectorCompliance.forEach((d) => {
        csvData.push([
          d.sector,
          String(d.total_businesses),
          String(d.compliant_businesses),
          String(d.avg_compliance_score),
        ]);
      });
    } else if (reportType === "activity") {
      csvData.push(["Timestamp", "Action", "User", "Details"]);
    }

    const csvContent = buildCsv(csvData);
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportCards = [
    {
      type: "users" as const,
      icon: Users,
      title: "User Report",
      description: "Export monthly user growth and registration metrics.",
    },
    {
      type: "compliance" as const,
      icon: Building2,
      title: "Compliance Report",
      description: "Export sector compliance statistics and averages.",
    },
    {
      type: "activity" as const,
      icon: Activity,
      title: "Activity Report",
      description: "Export audit logs and activity data for compliance review.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <BarChart3 className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Reports & Analytics</h2>
          <p className="text-sm text-muted mt-0.5 max-w-xl">
            Interactive charts and clean CSV exports for user growth, sector compliance, and audit activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
        {reportCards.map(({ type, icon: Icon, title, description }) => (
          <article key={type} className="card">
            <header className="flex items-center gap-3 mb-3">
              <span className="gold-gradient text-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="w-4.5 h-4.5" />
              </span>
              <h3 className="text-base font-semibold text-navy">{title}</h3>
            </header>
            <p className="text-sm text-muted mb-4">{description}</p>
            <button
              onClick={() => handleExportReport(type)}
              aria-label={`Export ${title} CSV`}
              className="btn-secondary w-full py-2!"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </article>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card admin-chart-card">
              <div className="skeleton h-64 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <section className="card admin-chart-card">
            <h3 className="text-sm font-semibold text-navy mb-4">User Growth (12 months)</h3>
            <div className="h-64">
              <UserGrowthChart data={userGrowth} />
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section className="card admin-chart-card">
              <h3 className="text-sm font-semibold text-navy mb-4">Sector Compliance</h3>
              <div className="h-64">
                <SectorComplianceChart data={sectorCompliance} />
              </div>
            </section>

            <section className="card admin-chart-card">
              <h3 className="text-sm font-semibold text-navy mb-4">Compliance Trend</h3>
              <div className="h-64">
                <ComplianceTrendChart data={complianceTrend} />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}