"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Bell, Plus, AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { SystemAlert } from "@/types/admin";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const hasLoaded = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    alert_type: "info",
    target_audience: "all",
    start_date: "",
    end_date: "",
  });

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/alerts");
      const result = (await response.json()) as {
        data?: SystemAlert[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Failed to load alerts");
      setAlerts(result.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      void loadAlerts();
    }
  }, [loadAlerts]);

  const handleCreateAlert = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) <= new Date(formData.start_date)
    ) {
      setError("The end date must be later than the start date.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Failed to create alert");
      setShowCreateForm(false);
      setFormData({ title: "", message: "", alert_type: "info", target_audience: "all", start_date: "", end_date: "" });
      await loadAlerts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setSaving(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-amber-200 bg-amber-50";
      case "success":
        return "border-emerald-200 bg-emerald-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <Bell className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">System Alerts</h2>
            <p className="text-sm text-muted mt-0.5">Manage platform-wide alerts and notifications</p>
          </div>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
          <Plus className="w-4 h-4 inline mr-2" />
          Create Alert
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          {!showCreateForm && (
            <button type="button" onClick={loadAlerts} className="underline underline-offset-2">
              Retry
            </button>
          )}
        </div>
      )}

      {showCreateForm && (
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Create New Alert</h3>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Alert title"
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input"
                rows={3}
                placeholder="Alert message"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Type</label>
                <select
                  value={formData.alert_type}
                  onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                  className="select"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="label">Target Audience</label>
                <select
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="select"
                >
                  <option value="all">All Users</option>
                  <option value="business">Business</option>
                  <option value="consultant">Consultant</option>
                  <option value="regulator">Regulator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Creating..." : "Create Alert"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <Bell className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No Active Alerts</h3>
          <p className="text-muted text-sm">Create alerts to notify users about important updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`card border ${getAlertColor(alert.alert_type)}`}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.alert_type)}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-navy">{alert.title}</h3>
                  <p className="text-sm text-muted mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted flex-wrap">
                    <span>Target: {alert.target_audience}</span>
                    {alert.start_date && <span>Starts: {new Date(alert.start_date).toLocaleDateString()}</span>}
                    {alert.end_date && <span>Ends: {new Date(alert.end_date).toLocaleDateString()}</span>}
                    <span className={`font-medium ${alert.is_active ? "text-emerald-600" : "text-red-600"}`}>
                      {alert.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}