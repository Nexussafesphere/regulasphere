"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  User,
  Star,
  Briefcase,
} from "lucide-react";

export default function ConsultantSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("Dr. Amina Ibrahim");
  const [bio, setBio] = useState(
    "Former NDPC auditor with expertise in AI governance frameworks."
  );
  const [specialization, setSpecialization] = useState("Data Protection");
  const [yearsExperience, setYearsExperience] = useState("12");
  const [availability, setAvailability] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "credentials", label: "Credentials", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-8 px-4 w-full max-w-full sm:max-w-3xl">
        <div className="flex items-center justify-between mb-4 md:mb-6 w-full">
          <div className="min-w-0">
            <Link
              href="/consultant"
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

        {activeTab === "profile" && (
          <div className="card bg-white border border-border w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">Profile</h3>
            <div className="space-y-4 w-full">
              <div>
                <label className="label text-xs sm:text-sm">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label text-xs sm:text-sm">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input w-full"
                  rows={3}
                />
              </div>
              <div>
                <label className="label text-xs sm:text-sm">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="select w-full"
                >
                  <option value="Data Protection">Data Protection</option>
                  <option value="AI Governance">AI Governance</option>
                  <option value="Tax">Tax</option>
                  <option value="CAC">CAC</option>
                  <option value="Pension">Pension</option>
                  <option value="Employment">Employment</option>
                </select>
              </div>
              <div>
                <label className="label text-xs sm:text-sm">Years of Experience</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-muted absolute left-3 md:left-4 top-1/2 -translate-y-1/2 shrink-0" />
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="input pl-10 md:pl-12 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="availability"
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  className="w-4 h-4 shrink-0"
                />
                <label htmlFor="availability" className="text-xs sm:text-sm text-secondary">
                  Available for new clients
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "credentials" && (
          <div className="card bg-white border border-border w-full">
            <h3 className="text-sm font-semibold text-navy mb-4">Credentials</h3>
            <div className="space-y-1 md:space-y-2 w-full">
              {["CDPO", "CIPP/E", "DPCO-2024-001"].map((credential) => (
                <div
                  key={credential}
                  className="flex items-center gap-2 py-2 border-b border-border last:border-b-0"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-xs md:text-sm text-secondary">{credential}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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