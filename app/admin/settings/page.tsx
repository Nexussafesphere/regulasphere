"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Save, Shield, Bell, Bot, Globe } from "lucide-react";

interface PlatformSettings {
  platform_name: string;
  support_email: string;
  admin_email: string;
  auto_verify_businesses: boolean;
  auto_verify_consultants: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  maintenance_mode: boolean;
  ai_enabled: boolean;
  max_file_size: number;
  default_language: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platform_name: "RegulaSphere",
  support_email: "nexusafesphere@outlook.com",
  admin_email: "nexussafesphere@outlook.com",
  auto_verify_businesses: false,
  auto_verify_consultants: false,
  email_notifications: true,
  push_notifications: true,
  maintenance_mode: false,
  ai_enabled: true,
  max_file_size: 10,
  default_language: "English",
};

function Toggle({
  label,
  checked,
  onChange,
  danger,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? (danger ? "bg-red-600" : "bg-emerald-600") : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const hasLoaded = useRef(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings");
      const result = (await response.json()) as {
        data?: PlatformSettings;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Failed to load settings");
      setSettings({ ...DEFAULT_SETTINGS, ...result.data });
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      void loadSettings();
    }
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await response.json()) as {
        data?: PlatformSettings;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Failed to save settings");
      setSettings({ ...DEFAULT_SETTINGS, ...result.data });
      setSaved(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <Key extends keyof PlatformSettings>(
    key: Key,
    value: PlatformSettings[Key]
  ) => {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <Globe className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">Admin Settings</h2>
            <p className="text-sm text-muted mt-0.5">Configure platform settings and preferences</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving || loading || Boolean(error)} className="btn-primary">
          <Save className="w-4 h-4 inline mr-2" />
          {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={loadSettings} className="underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-gold" />
            Platform Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => updateSetting("platform_name", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => updateSetting("support_email", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email"
                value={settings.admin_email}
                onChange={(e) => updateSetting("admin_email", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Default Language</label>
              <select
                value={settings.default_language}
                onChange={(e) => updateSetting("default_language", e.target.value)}
                className="select"
              >
                <option value="English">English</option>
                <option value="Yoruba">Yoruba</option>
                <option value="Hausa">Hausa</option>
                <option value="Igbo">Igbo</option>
                <option value="Pidgin">Pidgin</option>
              </select>
            </div>
            <div>
              <label className="label">Max File Size (MB)</label>
              <input
                type="number"
                value={settings.max_file_size}
                onChange={(e) => updateSetting("max_file_size", Number(e.target.value))}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-gold" />
            Verification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">Auto-Verify Businesses</p>
                <p className="text-xs text-muted">Automatically approve business verification requests</p>
              </div>
              <Toggle
                label="Auto-Verify Businesses"
                checked={settings.auto_verify_businesses}
                onChange={() => updateSetting("auto_verify_businesses", !settings.auto_verify_businesses)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">Auto-Verify Consultants</p>
                <p className="text-xs text-muted">Automatically approve consultant verification requests</p>
              </div>
              <Toggle
                label="Auto-Verify Consultants"
                checked={settings.auto_verify_consultants}
                onChange={() => updateSetting("auto_verify_consultants", !settings.auto_verify_consultants)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-gold" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">Email Notifications</p>
                <p className="text-xs text-muted">Send email notifications for important events</p>
              </div>
              <Toggle
                label="Email Notifications"
                checked={settings.email_notifications}
                onChange={() => updateSetting("email_notifications", !settings.email_notifications)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">Push Notifications</p>
                <p className="text-xs text-muted">Send push notifications for real-time updates</p>
              </div>
              <Toggle
                label="Push Notifications"
                checked={settings.push_notifications}
                onChange={() => updateSetting("push_notifications", !settings.push_notifications)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
            <Bot className="w-4.5 h-4.5 text-gold" />
            AI & System Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">AI Engine</p>
                <p className="text-xs text-muted">Enable or disable AI-powered features</p>
              </div>
              <Toggle label="AI Engine" checked={settings.ai_enabled} onChange={() => updateSetting("ai_enabled", !settings.ai_enabled)} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy">Maintenance Mode</p>
                <p className="text-xs text-muted">Put platform in maintenance mode</p>
              </div>
              <Toggle
                label="Maintenance Mode"
                checked={settings.maintenance_mode}
                onChange={() => updateSetting("maintenance_mode", !settings.maintenance_mode)}
                danger
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}