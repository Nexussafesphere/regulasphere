"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import type { FrameworkRiskScore } from "@/hooks/useRiskScores";

const LEVEL_COLORS: Record<FrameworkRiskScore["riskLevel"], string> = {
  Critical: "bg-red-500",
  High: "bg-amber-500",
  Medium: "bg-yellow-400",
  Low: "bg-green-500",
};

const LEVEL_TEXT: Record<FrameworkRiskScore["riskLevel"], string> = {
  Critical: "text-red-600",
  High: "text-amber-600",
  Medium: "text-yellow-600",
  Low: "text-green-600",
};

interface Props {
  scores: FrameworkRiskScore[];
  loading?: boolean;
}

export default function RiskByFramework({ scores, loading }: Props) {
  if (loading) {
    return (
      <div className="card w-full">
        <h3 className="text-sm font-semibold text-navy mb-4">Risk by Framework</h3>
        <p className="text-xs text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="card w-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-gold shrink-0" />
        <h3 className="text-sm font-semibold text-navy">Risk by Framework</h3>
      </div>

      <div className="space-y-3 w-full">
        {scores.map((s) => (
          <div key={s.regulator} className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-navy">{s.regulator}</span>
              <span className={`text-xs font-semibold ${LEVEL_TEXT[s.riskLevel]}`}>
                {s.riskLevel} ({s.riskScore})
              </span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${LEVEL_COLORS[s.riskLevel]}`}
                style={{ width: `${s.riskScore}%` }}
              />
            </div>
            <p className="text-[10px] text-muted mt-1">
              {s.totalObligations} obligation{s.totalObligations !== 1 ? "s" : ""}
              {s.overdue > 0 && ` · ${s.overdue} overdue`}
            </p>
          </div>
        ))}

        {scores.length === 0 && (
          <div className="text-center py-6 w-full">
            <ShieldCheck className="w-6 h-6 text-muted mx-auto mb-2" />
            <p className="text-xs text-muted">No obligations to score yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
