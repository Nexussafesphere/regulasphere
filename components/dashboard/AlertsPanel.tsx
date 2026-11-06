"use client";

import { Bell } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  regulator?: string;
  severity?: string;
  summary?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  maxItems?: number;
}

export default function AlertsPanel({ alerts, maxItems = 5 }: AlertsPanelProps) {
  return (
    <div className="space-y-2">
      {alerts.slice(0, maxItems).map((alert) => (
        <div
          key={alert.id}
          className="py-2 border-b border-border last:border-b-0"
        >
          <p className="text-xs font-medium text-navy">{alert.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted">{alert.regulator}</span>
            <span
              className={`badge ${
                alert.severity === "Critical" ? "badge-gold" : "badge-outline"
              }`}
            >
              {alert.severity || "Info"}
            </span>
          </div>
          {alert.summary && (
            <p className="text-xs text-secondary mt-1">{alert.summary}</p>
          )}
        </div>
      ))}
      {alerts.length === 0 && (
        <div className="flex items-center gap-2 py-2">
          <Bell className="w-4 h-4 text-muted" />
          <p className="text-xs text-muted">No alerts.</p>
        </div>
      )}
    </div>
  );
}