"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  Bot,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { getCurrentUser } from "@/lib/auth";

const STATUS_COLORS = ["#10B981", "#F59E0B", "#8A94A3", "#EF4444"];

export default function DashboardPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadBusinessId = useCallback(async () => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      setAuthError("You must be logged in to view your dashboard.");
      return;
    }

    const res = await fetch("/api/businesses");
    if (!res.ok) {
      setAuthError("No business profile found. Please complete onboarding.");
      return;
    }

    const { business } = await res.json();
    if (!business) {
      setAuthError("No business profile found. Please complete onboarding.");
      return;
    }

    setBusinessId(business.id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load business";
    setAuthError(message);
  }
}, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadBusinessId();
    }
  }, [loadBusinessId]);

  const { data, loading, error, reload } = useDashboard(businessId || "");

  if (authError) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-sm text-muted mb-4">{authError}</p>
          <Link href="/onboarding" className="btn btn-primary btn-sm">
            Complete Onboarding
          </Link>
        </div>
      </div>
    );
  }

  if (!businessId || loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-sm text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={reload} className="btn btn-primary btn-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const obligations = data.obligations as {
    id: string;
    status: string;
    category?: string;
    regulator?: string;
  }[];

  const completedCount = obligations.filter(
    (o) => o.status === "Completed"
  ).length;
  const overdueCount = obligations.filter(
    (o) => o.status === "Overdue"
  ).length;
  const pendingCount = obligations.filter((o) => o.status === "Pending").length;
  const inProgressCount = obligations.filter(
    (o) => o.status === "In Progress"
  ).length;
  const totalCount = obligations.length;

  const statusData = [
    { name: "Completed", value: completedCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Pending", value: pendingCount },
    { name: "Overdue", value: overdueCount },
  ];

  const categoryMap: Record<string, number> = {};

  for (const ob of obligations) {
    const category = ob.category || "Other";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  }

  const categoryData = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  const businessName =
    (data.business as { business_name?: string })?.business_name ||
    "Business";
  const sector = (data.business as { sector?: string })?.sector || "Unknown";

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-8 px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 w-full">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-navy truncate">
              Welcome, {businessName}
            </h1>
            <p className="text-xs md:text-sm text-muted">{sector} Sector</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 shrink-0">
            <span className="badge badge-gold flex items-center gap-1 text-[10px] md:text-xs">
              <Bot className="w-3 h-3 shrink-0" /> AI Monitoring
            </span>
            <Link
              href="/dashboard/reports"
              className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
            >
              <BarChart3 className="w-3 h-3 shrink-0" /> Generate Report
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6 w-full">
          <div className="card text-center py-4 md:py-6 col-span-2 sm:col-span-1 w-full">
            <div
              className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-2 md:mb-3"
              style={{
                background: `conic-gradient(var(--gold) ${data.complianceScore}%, var(--off-white) ${data.complianceScore}% 100%)`,
              }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center">
                <span className="text-sm md:text-lg font-bold text-navy">
                  {data.complianceScore}%
                </span>
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-muted">Compliance Score</p>
          </div>

          <div className="card text-center py-4 md:py-6 w-full">
            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-navy mb-0.5 md:mb-1">
              {totalCount}
            </p>
            <p className="text-[10px] md:text-xs text-muted">Total Obligations</p>
          </div>

          <div className="card text-center py-4 md:py-6 w-full">
            <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-500 mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-red-500 mb-0.5 md:mb-1">
              {overdueCount}
            </p>
            <p className="text-[10px] md:text-xs text-muted">Overdue</p>
          </div>

          <div className="card text-center py-4 md:py-6 w-full">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-500 mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-amber-500 mb-0.5 md:mb-1">
              {pendingCount + inProgressCount}
            </p>
            <p className="text-[10px] md:text-xs text-muted">In Progress</p>
          </div>

          <div className="card text-center py-4 md:py-6 w-full col-span-2 sm:col-span-1">
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600 mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-green-600 mb-0.5 md:mb-1">
              {completedCount}
            </p>
            <p className="text-[10px] md:text-xs text-muted">Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 w-full">
          <div className="card w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Obligation Status
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={70}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Obligations by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAEE" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="var(--gold)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 w-full">
          <div className="card lg:col-span-2 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gold shrink-0" />
                <h3 className="text-sm font-semibold text-navy">
                  AI Agent Insights
                </h3>
              </div>
              <Link
                href="/dashboard/chat"
                className="text-xs text-gold flex items-center gap-1 shrink-0"
              >
                Open Chat <ChevronRight className="w-3 h-3 shrink-0" />
              </Link>
            </div>
            <div className="space-y-2 w-full">
              {(data.activities as {
                id: string;
                activity_type: string;
                description: string;
              }[])
                .slice(0, 5)
                .map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 py-2 border-b border-border last:border-b-0"
                  >
                    <span className="shrink-0 mt-0.5">
                      {activity.activity_type === "Alert" && (
                        <Bell className="w-4 h-4 text-gold" />
                      )}
                      {activity.activity_type === "Recommendation" && (
                        <Bot className="w-4 h-4 text-blue-500" />
                      )}
                      {activity.activity_type === "Risk Assessment" && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {activity.activity_type === "Document Check" && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </span>
                    <p className="text-xs text-secondary leading-relaxed wrap-break-words">
                      {activity.description}
                    </p>
                  </div>
                ))}
              {(data.activities as unknown[]).length === 0 && (
                <p className="text-xs text-muted">No AI insights yet.</p>
              )}
            </div>
          </div>

          <div className="card w-full">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-gold shrink-0" />
              <h3 className="text-sm font-semibold text-navy">
                Live Regulatory Alerts
              </h3>
            </div>
            <div className="space-y-2 w-full">
              {(data.alerts as {
                id: string;
                title: string;
                regulator?: string;
                severity?: string;
              }[])
                .slice(0, 5)
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="py-2 border-b border-border last:border-b-0"
                  >
                    <p className="text-xs font-medium text-navy wrap-break-words">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {alert.regulator} | {alert.severity || "Info"}
                    </p>
                  </div>
                ))}
              {(data.alerts as unknown[]).length === 0 && (
                <p className="text-xs text-muted">No alerts.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}