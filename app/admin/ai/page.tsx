"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Database, RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface AITrainingData {
  id: string;
  prompt: string;
  completion: string;
  category: string;
  language: string;
  quality_score: number;
  is_validated: boolean;
  created_at: string;
}

export default function AdminAIPage() {
  const [trainingData, setTrainingData] = useState<AITrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadAIData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/ai/data");
      const result = (await response.json()) as {
        data?: AITrainingData[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Failed to load training data");
      setTrainingData(result.data ?? []);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load training data");
      setTrainingData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      void loadAIData();
    }
  }, [loadAIData]);

  const handleReview = async (trainingDataId: string, reviewStatus: "approved" | "rejected") => {
    setReviewingId(trainingDataId);
    setReviewError(null);
    try {
      const response = await fetch("/api/admin/ai/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingDataId, reviewStatus }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Failed to save review");
      await loadAIData();
    } catch (error: unknown) {
      setReviewError(error instanceof Error ? error.message : "Failed to save review");
    } finally {
      setReviewingId(null);
    }
  };

  const stats = {
    total: trainingData.length,
    validated: trainingData.filter((item) => item.is_validated).length,
    pending: trainingData.filter((item) => !item.is_validated).length,
    categories: new Set(trainingData.map((item) => item.category)).size,
  };

  const statCards = [
    { label: "Total Data Points", value: stats.total, icon: Database, color: "text-navy" },
    { label: "Validated", value: stats.validated, icon: CheckCircle, color: "text-emerald-600" },
    { label: "Pending Review", value: stats.pending, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Categories", value: stats.categories, icon: Bot, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">AI Training Management</h2>
            <p className="text-sm text-muted mt-0.5">Monitor and manage AI training data</p>
          </div>
        </div>
        <button onClick={loadAIData} disabled={loading} className="btn-primary disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {(loadError || reviewError) && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {reviewError || loadError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</h3>
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : trainingData.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <Bot className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No Training Data Available</h3>
          <p className="text-muted text-sm">AI training data will appear here once your Python scripts complete.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Prompt</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    Quality Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trainingData.map((data) => (
                  <tr key={data.id} className="hover:bg-[#FAFAF7] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-navy line-clamp-2">{data.prompt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full">
                        {data.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{data.language}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${
                          data.quality_score >= 4
                            ? "text-emerald-600"
                            : data.quality_score >= 3
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {data.quality_score}/5
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                          data.is_validated
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : "bg-amber-50 text-amber-700 ring-amber-100"
                        }`}
                      >
                        {data.is_validated ? "Validated" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReview(data.id, "approved")}
                        disabled={reviewingId !== null}
                        className="text-emerald-600 hover:text-emerald-700 mr-3 disabled:opacity-50"
                        aria-label={`Approve ${data.id}`}
                      >
                        <CheckCircle className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleReview(data.id, "rejected")}
                        disabled={reviewingId !== null}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        aria-label={`Reject ${data.id}`}
                      >
                        <XCircle className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}