"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Shield,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface AlertItem {
  id: string;
  title: string;
  regulator?: string;
  severity?: string;
  summary?: string;
  action_required?: string;
  deadline?: string;
  created_at?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await fetch("/api/alert");
      if (!res.ok) throw new Error("Failed to load alerts");
      const { alerts: data } = await res.json();
      setAlerts(data as AlertItem[]);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load alerts");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadAlerts();
    }
  }, [loadAlerts]);

  const getSeverityIcon = (severity: string | undefined) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
      case "High":
        return <Shield className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-muted shrink-0" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading alerts...</p>
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
              Regulatory Alerts
            </h1>
          </div>
          <button
            onClick={loadAlerts}
            className="btn btn-secondary btn-sm flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3 h-3 shrink-0" /> Refresh
          </button>
        </div>

        {loadError && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{loadError}</span>
            <button type="button" onClick={loadAlerts} className="underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        <div className="space-y-3 w-full">
          {alerts.map((alert) => (
            <div key={alert.id} className="card w-full">
              <div className="flex items-start gap-3 w-full">
                <span className="shrink-0 mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {alert.title}
                    </h3>
                    <span
                      className={`badge shrink-0 ${
                        alert.severity === "Critical"
                          ? "badge-gold"
                          : "badge-outline"
                      }`}
                    >
                      {alert.severity || "Info"}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {alert.regulator || "Unknown"}
                  </p>
                  {alert.summary && (
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {alert.summary}
                    </p>
                  )}
                  {alert.action_required && (
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      Action: {alert.action_required}
                    </p>
                  )}
                  {alert.deadline && (
                    <p className="text-xs text-red-500 mt-1">
                      Deadline: {alert.deadline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && !loadError && (
            <div className="text-center py-12 w-full">
              <Bell className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}