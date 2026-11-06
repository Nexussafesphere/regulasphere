"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Building2, Bot, CheckCircle2 } from "lucide-react";
import {
  initialAnswers,
  getVisibleQuestions,
  SECTORS,
  STATES,
  type OnboardingAnswers,
} from "@/lib/onboarding-questions";
import DynamicQuestion from "@/components/onboarding/DynamicQuestion";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingAnswers>(initialAnswers);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [obligationsPreview, setObligationsPreview] = useState<
    { title: string; priority: string; regulator: string }[]
  >([]);

  const updateField = (key: keyof OnboardingAnswers, value: string | number | boolean) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const bizRes = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: data.businessName,
          rc_number: data.rcNumber,
          tin: data.tin,
          sector: data.sector,
          state: data.state,
          employee_count: data.employeeCount === "" ? 0 : data.employeeCount,
          annual_revenue: data.annualRevenue,
          data_processing: data.dataProcessing,
          has_sensitive_data: data.hasSensitiveData,
          has_cross_border_transfer: data.hasCrossBorderTransfer,
          data_subjects_count: data.dataSubjectsCount === "" ? 0 : data.dataSubjectsCount,
          has_data_protection_officer: data.hasDataProtectionOfficer,
          dpco_engaged: data.dpcoEngaged,
          has_foreign_operations: data.hasForeignOperations,
          is_fintech: data.isFintech,
          uses_ai: data.usesAI,
          ai_systems_description: data.aiSystemsDescription,
        }),
      });

      if (!bizRes.ok) throw new Error("Failed to save business profile");
      const { business } = await bizRes.json();

      const onboardRes = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          businessProfile: business,
        }),
      });

      if (!onboardRes.ok) throw new Error("Failed to generate compliance roadmap");
      const { obligations } = await onboardRes.json();

      setObligationsPreview(
        (obligations || []).map(
          (o: { title: string; priority: string; regulator: string }) => ({
            title: o.title,
            priority: o.priority,
            regulator: o.regulator,
          })
        )
      );

      setIsAnalyzing(false);
      handleNext();
    } catch (err: unknown) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
      setIsAnalyzing(false);
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const visibleQuestions = getVisibleQuestions(data);

  return (
    <section className="bg-off-white min-h-screen py-8 sm:py-12 md:py-20 w-full">
      <div className="container max-w-full sm:max-w-xl md:max-w-2xl px-4 w-full mx-auto">
        <div className="card w-full">
          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`h-1 md:h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    stepNumber <= step ? "bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted">Step {step} of 4</p>
          </div>

          {/* Step 1: Business Information */}
          {step === 1 && (
            <div className="space-y-4 md:space-y-5 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                </div>
                <h2 className="text-lg md:text-xl">Business Information</h2>
              </div>

              <div className="w-full">
                <label className="label">Business Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={data.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="Your business name"
                />
              </div>

              <div className="w-full">
                <label className="label">CAC Registration Number (RC)</label>
                <input
                  type="text"
                  className="input w-full"
                  value={data.rcNumber}
                  onChange={(e) => updateField("rcNumber", e.target.value)}
                  placeholder="RC-1234567"
                />
              </div>

              <div className="w-full">
                <label className="label">Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  className="input w-full"
                  value={data.tin}
                  onChange={(e) => updateField("tin", e.target.value)}
                  placeholder="TIN-987654321"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="label">Sector</label>
                  <select
                    className="select w-full"
                    value={data.sector}
                    onChange={(e) => updateField("sector", e.target.value)}
                  >
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted mt-1">
                    Your sector determines which follow-up questions you&apos;ll see next.
                  </p>
                </div>
                <div>
                  <label className="label">State</label>
                  <select
                    className="select w-full"
                    value={data.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  >
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="btn btn-primary w-full text-sm md:text-base"
              >
                Continue <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}

          {/* Step 2: Dynamic, sector-adaptive questionnaire */}
          {step === 2 && (
            <div className="space-y-4 md:space-y-5 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                </div>
                <h2 className="text-lg md:text-xl">Business Details</h2>
              </div>
              <p className="text-xs text-muted -mt-2">
                Questions adapt as you answer — more will appear based on your responses.
              </p>

              <div className="space-y-1 md:space-y-2 pt-2 w-full">
                {visibleQuestions.map((q) => (
                  <DynamicQuestion
                    key={q.key}
                    question={q}
                    value={data[q.key]}
                    onChange={updateField}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleBack}
                  className="btn btn-secondary w-full sm:flex-1 text-sm md:text-base"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-primary w-full sm:flex-1 text-sm md:text-base"
                >
                  Continue <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Analysis — runs the real policy-engine matching */}
          {step === 3 && (
            <div className="space-y-6 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                </div>
                <h2 className="text-lg md:text-xl">AI Analysis</h2>
              </div>

              {analysisError && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600">
                  {analysisError}
                </div>
              )}

              {isAnalyzing ? (
                <div className="space-y-3 text-center py-6 md:py-8 w-full">
                  <div className="spinner mx-auto" />
                  <p className="text-sm md:text-base text-secondary">
                    Analyzing your business profile...
                  </p>
                  <p className="text-xs md:text-sm text-muted">
                    Identifying applicable regulations across 10+ regulators
                  </p>
                </div>
              ) : (
                <p className="text-sm text-secondary text-center py-4">
                  Ready to analyze your compliance requirements.
                </p>
              )}

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="btn btn-primary w-full text-sm md:text-base"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Analyzing...
                  </>
                ) : (
                  <>
                    Run Analysis <ChevronRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Roadmap Generated — real results from the policy engine */}
          {step === 4 && (
            <div className="space-y-4 md:space-y-5 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <h2 className="text-lg md:text-xl">Compliance Roadmap Generated</h2>
              </div>

              <p className="text-sm md:text-base text-secondary">
                We identified {obligationsPreview.length} regulations that apply to your business.
              </p>

              <div className="space-y-1 md:space-y-2 w-full">
                {obligationsPreview.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 md:py-3 border-b border-border last:border-none"
                  >
                    <span className="text-xs sm:text-sm text-secondary">
                      {item.title} <span className="text-muted">({item.regulator})</span>
                    </span>
                    <span
                      className={`badge ${
                        item.priority === "Critical" ? "badge-gold" : "badge-outline"
                      } self-start sm:self-auto`}
                    >
                      {item.priority}
                    </span>
                  </div>
                ))}
                {obligationsPreview.length === 0 && (
                  <p className="text-xs text-muted">
                    No specific obligations matched — you may still have general requirements.
                  </p>
                )}
              </div>

              <button onClick={goToDashboard} className="btn btn-primary w-full text-sm md:text-base">
                Go to Dashboard <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
