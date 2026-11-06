"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Bell,
  Globe,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [businessName, setBusinessName] = useState("Lagos Fintech Solutions");
  const [email, setEmail] = useState("business@demo.com");
  const [phone, setPhone] = useState("+2348000000001");
  const [language, setLanguage] = useState("English");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: false,
    deadlineReminders: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "language", label: "Language", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-8 px-4 w-full max-w-full sm:max-w-3xl">
        <div className="flex items-center justify-between mb-4 md:mb-6 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              Settings
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 border-b border-border mb-4 md:mb-6 overflow-x-auto w-full">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? "border-gold text-gold"
                    : "border-transparent text-muted hover:text-navy"
                }`}
              >
                <Icon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card bg-white border border-border w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Business Profile
            </h3>
            <div className="space-y-4 w-full">
              <div>
                <label className="label text-xs sm:text-sm">Business Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted absolute left-3 md:left-4 top-1/2 -translate-y-1/2 shrink-0" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="input pl-10 md:pl-12 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="label text-xs sm:text-sm">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 md:left-4 top-1/2 -translate-y-1/2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10 md:pl-12 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="label text-xs sm:text-sm">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 md:left-4 top-1/2 -translate-y-1/2 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input pl-10 md:pl-12 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="card bg-white border border-border w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-1 md:space-y-2 w-full">
              {[
                {
                  key: "emailAlerts" as const,
                  label: "Email Alerts",
                  description: "Receive compliance alerts via email",
                  icon: Mail,
                },
                {
                  key: "smsAlerts" as const,
                  label: "SMS Alerts",
                  description: "Get deadline reminders via SMS",
                  icon: Phone,
                },
                {
                  key: "whatsappAlerts" as const,
                  label: "WhatsApp Alerts",
                  description: "Receive notifications on WhatsApp",
                  icon: MessageCircle,
                },
                {
                  key: "deadlineReminders" as const,
                  label: "Deadline Reminders",
                  description: "Get notified 30 days before deadlines",
                  icon: Bell,
                },
                {
                  key: "weeklyDigest" as const,
                  label: "Weekly Digest",
                  description: "Summary of compliance activity",
                  icon: CheckCircle2,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 py-2 md:py-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-gold shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-medium text-navy truncate">
                          {item.label}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.key)}
                      className={`relative w-10 md:w-12 h-5 md:h-6 rounded-full transition-colors shrink-0 ${
                        notifications[item.key] ? "bg-gold" : "bg-border"
                      }`}
                      aria-label={`Toggle ${item.label}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 md:w-5 h-4 md:h-5 rounded-full bg-white shadow transition-all ${
                          notifications[item.key] ? "left-5 md:left-6" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Language Tab */}
        {activeTab === "language" && (
          <div className="card bg-white border border-border w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Language Preferences
            </h3>
            <div className="w-full">
              <label className="label text-xs sm:text-sm">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="select w-full"
              >
                <option value="English">English</option>
                <option value="Yoruba">Yoruba</option>
                <option value="Hausa">Hausa</option>
                <option value="Igbo">Igbo</option>
                <option value="Pidgin">Pidgin English</option>
              </select>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 md:mt-6 w-full">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" /> Save Changes
              </>
            )}
          </button>
          {saved && (
            <p className="text-sm text-gold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Saved successfully
            </p>
          )}
        </div>
      </div>
    </div>
  );
}