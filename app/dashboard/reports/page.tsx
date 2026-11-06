"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Report {
  id: string;
  business_id: string;
  overall_score: number;
  summary: string;
  recommendations: string[];
  verified_by_consultant?: boolean;
  consultant_id?: string;
  pdf_path?: string;
  created_at?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [reportType, setReportType] = useState("Monthly Summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<{
    reportId: string;
    message: string;
  } | null>(null);

  const hasLoaded = useRef(false);

  const resolveBusinessId = useCallback(async (): Promise<string> => {
    if (businessId) return businessId;
    const bizRes = await fetch("/api/businesses");
    if (!bizRes.ok) throw new Error("Failed to resolve business");
    const { business } = await bizRes.json();
    if (!business) throw new Error("No business profile found");
    setBusinessId(business.id);
    return business.id;
  }, [businessId]);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const id = await resolveBusinessId();
      const res = await fetch(`/api/reports?businessId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to load reports");
      const { reports: data } = await res.json();
      setReports(data as Report[]);
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [resolveBusinessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadReports();
    }
  }, [loadReports]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGenerated(false);

    try {
      const id = await resolveBusinessId();
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: id, reportType }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to generate report");
      }

      setGenerated(true);
      await loadReports();
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    setDownloadingId(reportId);
    setDownloadError(null);
    try {
      const res = await fetch(`/api/reports/${reportId}/signed-url`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "PDF not available for this report");
      }
      const { url } = await res.json();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      setDownloadError({
        reportId,
        message:
          err instanceof Error ? err.message : "Unable to download this report",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "Unknown date";
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              Compliance Reports
            </h1>
          </div>
        </div>

        <div className="card mb-4 md:mb-6 w-full">
          <h3 className="text-sm font-semibold text-navy mb-4">Generate New Report</h3>

          {generateError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3 text-xs text-red-600 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {generateError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
            <div>
              <label className="label text-xs sm:text-sm">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="select w-full text-sm"
              >
                <option value="Monthly Summary">Monthly Summary</option>
                <option value="Quarterly Report">Quarterly Report</option>
                <option value="Annual Audit">Annual Audit</option>
                <option value="Regulatory Filing">Regulatory Filing</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 shrink-0" /> Generate
                  </>
                )}
              </button>
            </div>
          </div>
          {generated && (
            <p className="text-xs text-gold mt-3">
              Report generated successfully. Check below.
            </p>
          )}
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-xs text-red-600 flex items-center justify-between">
            <span>{loadError}</span>
            <button onClick={loadReports} className="btn btn-secondary btn-sm text-xs">
              Retry
            </button>
          </div>
        )}

        <div className="space-y-3 md:space-y-4 w-full">
          {reports.map((report) => (
            <div key={report.id} className="card w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-navy truncate">
                    Report — {formatDate(report.created_at)}
                  </h3>
                  <p className="text-xs text-muted">
                    {report.verified_by_consultant
                      ? "Verified by consultant"
                      : "Not yet verified"}
                  </p>
                </div>
                <span
                  className={`text-xl md:text-2xl font-bold ${getScoreColor(
                    report.overall_score
                  )} shrink-0`}
                >
                  {report.overall_score}%
                </span>
              </div>

              <p className="text-xs md:text-sm text-secondary mb-3 leading-relaxed">
                {report.summary}
              </p>

              {report.recommendations && report.recommendations.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-navy mb-2">Recommendations:</p>
                  <ul className="space-y-1">
                    {report.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="text-xs text-secondary flex items-start gap-2 leading-relaxed"
                      >
                        <CheckCircle2 className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {downloadError?.reportId === report.id && (
                <p role="alert" className="text-xs text-red-600 mb-3">
                  {downloadError.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 w-full">
                <button
                  onClick={() => handleDownload(report.id)}
                  disabled={downloadingId === report.id || !report.pdf_path}
                  className="btn btn-secondary btn-sm flex items-center gap-1 text-xs"
                >
                  <Download className="w-3 h-3 shrink-0" />
                  {downloadingId === report.id
                    ? "Loading..."
                    : report.pdf_path
                    ? "Download PDF"
                    : "PDF unavailable"}
                </button>
              </div>
            </div>
          ))}

          {reports.length === 0 && !loadError && (
            <div className="text-center py-12 w-full">
              <BarChart3 className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">
                No reports yet — generate your first one above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}