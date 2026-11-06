// lib/risk-scoring.ts
//
// Computes a risk score per regulatory framework (NDPC, CBN, NRS, etc.) for a
// business, based on the priority and status of that business's obligations
// under each regulator. Pure function — no DB access — so it can be unit
// tested and reused from any route.

export interface ObligationForScoring {
  regulator: string;
  status: string;
  priority?: string;
}

export interface FrameworkRiskScore {
  regulator: string;
  totalObligations: number;
  completed: number;
  overdue: number;
  pending: number;
  inProgress: number;
  riskScore: number; // 0-100, higher = more risk
  riskLevel: "Low" | "Medium" | "High" | "Critical";
}

// Tunable: how much each priority level contributes to risk before status is factored in.
const PRIORITY_WEIGHT: Record<string, number> = {
  Critical: 40,
  High: 25,
  Medium: 10,
  Low: 5,
};

// Tunable: how urgency of the current status scales that priority weight.
// Completed = 0 (resolved, no ongoing risk). Overdue is weighted above 1x
// since a missed deadline is worse than one still pending.
const STATUS_MULTIPLIER: Record<string, number> = {
  Overdue: 1.5,
  Pending: 1,
  "Under Review": 0.75,
  "In Progress": 0.5,
  Completed: 0,
};

function riskLevelFromScore(score: number): FrameworkRiskScore["riskLevel"] {
  if (score >= 70) return "Critical";
  if (score >= 40) return "High";
  if (score >= 15) return "Medium";
  return "Low";
}

export function computeFrameworkRiskScores(
  obligations: ObligationForScoring[]
): FrameworkRiskScore[] {
  const byRegulator = new Map<string, ObligationForScoring[]>();

  for (const ob of obligations) {
    const list = byRegulator.get(ob.regulator) || [];
    list.push(ob);
    byRegulator.set(ob.regulator, list);
  }

  const results: FrameworkRiskScore[] = [];

  for (const [regulator, obs] of byRegulator.entries()) {
    let rawScore = 0;
    let completed = 0;
    let overdue = 0;
    let pending = 0;
    let inProgress = 0;

    for (const ob of obs) {
      const priorityWeight =
        PRIORITY_WEIGHT[ob.priority || "Medium"] ?? PRIORITY_WEIGHT.Medium;
      const statusMultiplier = STATUS_MULTIPLIER[ob.status] ?? 1;
      rawScore += priorityWeight * statusMultiplier;

      if (ob.status === "Completed") completed++;
      else if (ob.status === "Overdue") overdue++;
      else if (ob.status === "Pending") pending++;
      else if (ob.status === "In Progress") inProgress++;
    }

    const riskScore = Math.min(100, Math.round(rawScore));

    results.push({
      regulator,
      totalObligations: obs.length,
      completed,
      overdue,
      pending,
      inProgress,
      riskScore,
      riskLevel: riskLevelFromScore(riskScore),
    });
  }

  return results.sort((a, b) => b.riskScore - a.riskScore);
}