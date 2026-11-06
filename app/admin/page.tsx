"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  UserCheck,
  ClipboardList,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  AlertTriangle,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import {
  UserGrowthChart,
  SectorComplianceChart,
  ComplianceTrendChart,
} from "@/components/admin/AdminCharts";
import ActivityLog from "@/components/admin/ActivityLog";
import { adminApi } from "@/lib/admin-api";
import {
  AdminDashboardStats,
  UserGrowthData,
  SectorComplianceData,
  AdminActivity,
  VerificationRequest,
} from "@/types/admin";
import Link from "next/link";

/** Chart/activity panel wrapper — picks up .card + .admin-chart-card rules from globals.css (min-height, hover shadow). */
function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="card admin-chart-card">
      <h3 className="flex items-center gap-2.5 mb-5">
        <span className="gold-gradient text-navy flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-sm font-semibold text-navy">{title}</span>
      </h3>
      {children}
    </div>
  );
}

interface ComplianceTrendPoint {
  month: string;
  avg_score: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [sectorCompliance, setSectorCompliance] = useState<SectorComplianceData[]>([]);
  const [complianceTrend, setComplianceTrend] = useState<ComplianceTrendPoint[]>([]);
  const [recentActivities, setRecentActivities] = useState<AdminActivity[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [statsData, growthData, sectorData, activitiesData, verificationsData] =
          await Promise.all([
            adminApi.getDashboardStats(),
            adminApi.getUserGrowth(6),
            adminApi.getSectorCompliance(),
            adminApi.getAuditLogs(1, 5),
            adminApi.getPendingVerifications(),
          ]);

        if (!isMounted) return;

        setStats(statsData);
        setUserGrowth(growthData);
        setSectorCompliance(sectorData);
        setComplianceTrend(
          activitiesData.data?.map((activity: AdminActivity) => ({
            month: new Date(activity.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            avg_score: statsData.avg_compliance_score || 0,
          })) || []
        );
        setRecentActivities(activitiesData.data || []);
        setPendingVerifications(verificationsData || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-10 w-10 mb-4" />
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-6 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card admin-chart-card">
              <div className="skeleton h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
      {pendingVerifications.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm font-medium text-amber-900">
                {pendingVerifications.length} verification
                {pendingVerifications.length === 1 ? "" : "s"} require immediate review.
              </p>
            </div>
            <Link
              href="/admin/consultants/verify"
              className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0"
            >
              Review Queue
            </Link>
          </div>
        </div>
      )}

      {/* High-level KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
        />
        <StatCard
          title="Businesses"
          value={stats?.total_businesses || 0}
          icon={Building2}
        />
        <StatCard
          title="Consultants"
          value={stats?.total_consultants || 0}
          icon={UserCheck}
        />
        <StatCard
          title="Obligations"
          value={stats?.total_obligations || 0}
          icon={ClipboardList}
        />
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Pending Verifications"
          value={stats?.pending_verifications || 0}
          icon={FileText}
          trend="neutral"
          className="border-l-4 border-l-amber-500"
        />
        <StatCard
          title="Active Alerts"
          value={stats?.active_alerts || 0}
          icon={Bell}
          trend="neutral"
          className="border-l-4 border-l-red-500"
        />
        <StatCard
          title="Compliance Score"
          value={`${stats?.avg_compliance_score || 0}%`}
          icon={TrendingUp}
          trend="neutral"
          className="border-l-4 border-l-emerald-500"
        />
        <StatCard
          title="Reports Generated"
          value={stats?.total_reports || 0}
          icon={Activity}
          trend="neutral"
          className="border-l-4 border-l-(--gold)"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="User Growth" icon={TrendingUp}>
          <div className="h-64">
            <UserGrowthChart data={userGrowth} />
          </div>
        </Panel>
        <Panel title="Sector Compliance" icon={PieChartIcon}>
          <div className="h-64">
            <SectorComplianceChart data={sectorCompliance} />
          </div>
        </Panel>
      </div>

      {/* Historical Data & Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Compliance Trend" icon={LineChartIcon}>
          <div className="h-64">
            <ComplianceTrendChart data={complianceTrend} />
          </div>
        </Panel>
        <Panel title="Recent Activity" icon={Activity}>
          <ActivityLog activities={recentActivities} />
        </Panel>
      </div>
    </div>
  );
}