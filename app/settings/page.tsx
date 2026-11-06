"use client";

import { useState } from "react";
import { Settings, Building2, Bell, Bot, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("Lagos Fintech Solutions");
  const [email, setEmail] = useState("business@demo.com");
  const [phone, setPhone] = useState("+2348000000001");
  const [language, setLanguage] = useState("English");
  const [monitoringFrequency, setMonitoringFrequency] = useState("realtime");
  const [alertSensitivity, setAlertSensitivity] = useState("high");
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    push: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const toggleNotification = (key: "email" | "whatsapp" | "push") => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <section className="bg-navy text-white py-10 md:py-16 w-full">
        <div className="container max-w-full sm:max-w-3xl px-4 w-full mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-gold" />
            </div>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mb-0">Settings</h1>
          </div>
          <p className="text-silver text-sm md:text-base">
            Manage your account, notifications, and preferences.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 w-full">
        <div className="container max-w-full sm:max-w-3xl px-4 w-full mx-auto space-y-6 md:space-y-8">
          {/* Business Profile Card */}
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Building2 className="w-5 h-5 text-navy shrink-0" />
              <h3 className="text-base md:text-lg mb-0">Business Profile</h3>
            </div>
            <div className="space-y-4 w-full">
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Business Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Phone</label>
                <input
                  type="tel"
                  className="input w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Preferred Language</label>
                <select
                  className="select w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Hausa">Hausa</option>
                  <option value="Igbo">Igbo</option>
                  <option value="Pidgin">Pidgin English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Bell className="w-5 h-5 text-navy shrink-0" />
              <h3 className="text-base md:text-lg mb-0">Notifications</h3>
            </div>
            <div className="space-y-2 md:space-y-3 w-full">
              {[
                { key: "email" as const, label: "Email Notifications", description: "Receive compliance alerts via email" },
                { key: "whatsapp" as const, label: "WhatsApp Alerts", description: "Get instant updates on WhatsApp" },
                { key: "push" as const, label: "Push Notifications", description: "Browser push notifications" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 py-2 md:py-3 border-b border-border last:border-none"
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-secondary font-medium">
                      {item.label}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted truncate">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`relative w-10 md:w-11 h-5 md:h-6 rounded-full transition-colors shrink-0 ${
                      notifications[item.key] ? "bg-gold" : "bg-border"
                    }`}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 md:w-5 h-4 md:h-5 rounded-full bg-white transition-all ${
                        notifications[item.key] ? "left-5 md:left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Preferences Card */}
          <div className="card w-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Bot className="w-5 h-5 text-navy shrink-0" />
              <h3 className="text-base md:text-lg mb-0">AI Agent Preferences</h3>
            </div>
            <div className="space-y-4 w-full">
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Monitoring Frequency</label>
                <select
                  className="select w-full"
                  value={monitoringFrequency}
                  onChange={(e) => setMonitoringFrequency(e.target.value)}
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="w-full">
                <label className="label text-xs sm:text-sm">Alert Sensitivity</label>
                <select
                  className="select w-full"
                  value={alertSensitivity}
                  onChange={(e) => setAlertSensitivity(e.target.value)}
                >
                  <option value="high">High (All alerts)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low (Critical only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary w-full sm:w-auto text-sm md:text-base"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 shrink-0" />
                  Save Changes
                </>
              )}
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Saved successfully
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}