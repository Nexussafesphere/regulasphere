// lib/policy-engine.ts
//
// Policy-as-code evaluator. Determines whether a regulatory obligation
// applies to a specific business by checking:
//   1. minimum_employees (dedicated column on regulatory_obligations)
//   2. applicable_sectors (dedicated column on regulatory_obligations)
//   3. trigger_conditions (JSON field — everything else)
//
// trigger_conditions keys map directly to columns on `businesses`:
//   - boolean key (e.g. "is_fintech")       -> business[key] must === true
//   - "min_<column>" (e.g. "min_data_subjects_count") -> business[column] >= value
//   - "max_<column>"                         -> business[column] <= value
//   - "states"                               -> business.state must be in the array
//
// Unrecognized or omitted keys are treated as "don't care" and always pass.

export interface Business {
  id: string;
  sector: string | null;
  employee_count: number | null;
  data_processing: boolean | null;
  data_subjects_count: number | null;
  has_sensitive_data: boolean | null;
  has_cross_border_transfer: boolean | null;
  has_data_protection_officer: boolean | null;
  dpco_engaged: boolean | null;
  has_foreign_operations: boolean | null;
  is_fintech: boolean | null;
  uses_ai: boolean | null;
  state: string | null;
  [key: string]: unknown; // tolerate extra columns without breaking
}

export interface RegulatoryObligation {
  id: string;
  title: string;
  regulator: string;
  minimum_employees: number | null;
  applicable_sectors: string[] | null;
  trigger_conditions: Record<string, unknown> | null;
}

export interface PolicyEvaluationResult {
  obligationId: string;
  title: string;
  applies: boolean;
  reasons: string[]; // human-readable explanation, both for matches and mismatches
}

const NUMERIC_PREFIX_MIN = "min_";
const NUMERIC_PREFIX_MAX = "max_";

function evaluateCondition(
  key: string,
  expected: unknown,
  business: Business
): { pass: boolean; reason: string } {
  // states: array membership check
  if (key === "states" && Array.isArray(expected)) {
    const pass = business.state ? expected.includes(business.state) : false;
    return {
      pass,
      reason: pass
        ? `State "${business.state}" is in the required list`
        : `State "${business.state ?? "unknown"}" is not in required states: ${expected.join(", ")}`,
    };
  }

  // min_<field>: numeric >= comparison
  if (key.startsWith(NUMERIC_PREFIX_MIN)) {
    const field = key.slice(NUMERIC_PREFIX_MIN.length);
    const actual = business[field];
    const threshold = expected as number;
    const actualNum = typeof actual === "number" ? actual : null;
    const pass = actualNum !== null && actualNum >= threshold;
    return {
      pass,
      reason: pass
        ? `${field} (${actualNum}) meets minimum ${threshold}`
        : `${field} (${actualNum ?? "unset"}) is below required minimum ${threshold}`,
    };
  }

  // max_<field>: numeric <= comparison
  if (key.startsWith(NUMERIC_PREFIX_MAX)) {
    const field = key.slice(NUMERIC_PREFIX_MAX.length);
    const actual = business[field];
    const threshold = expected as number;
    const actualNum = typeof actual === "number" ? actual : null;
    const pass = actualNum !== null && actualNum <= threshold;
    return {
      pass,
      reason: pass
        ? `${field} (${actualNum}) is within maximum ${threshold}`
        : `${field} (${actualNum ?? "unset"}) exceeds maximum ${threshold}`,
    };
  }

  // plain boolean flag: business[key] must equal expected
  const actual = business[key];
  const pass = actual === expected;
  return {
    pass,
    reason: pass
      ? `${key} is ${expected} as required`
      : `${key} is ${actual ?? "unset"}, required ${expected}`,
  };
}

export function evaluateObligation(
  obligation: RegulatoryObligation,
  business: Business
): PolicyEvaluationResult {
  const reasons: string[] = [];
  let applies = true;

  // 1. Minimum employees
  if (obligation.minimum_employees && obligation.minimum_employees > 0) {
    const count = business.employee_count ?? 0;
    const pass = count >= obligation.minimum_employees;
    reasons.push(
      pass
        ? `Employee count (${count}) meets minimum ${obligation.minimum_employees}`
        : `Employee count (${count}) is below required minimum ${obligation.minimum_employees}`
    );
    if (!pass) applies = false;
  }

  // 2. Applicable sectors
  if (obligation.applicable_sectors && obligation.applicable_sectors.length > 0) {
    const sectors = obligation.applicable_sectors;
    const pass =
      sectors.includes("All") ||
      (business.sector != null && sectors.includes(business.sector));
    reasons.push(
      pass
        ? `Sector "${business.sector}" matches applicable sectors`
        : `Sector "${business.sector ?? "unset"}" not in applicable sectors: ${sectors.join(", ")}`
    );
    if (!pass) applies = false;
  }

  // 3. Custom trigger_conditions
  if (obligation.trigger_conditions) {
    for (const [key, expected] of Object.entries(obligation.trigger_conditions)) {
      const { pass, reason } = evaluateCondition(key, expected, business);
      reasons.push(reason);
      if (!pass) applies = false;
    }
  }

  if (reasons.length === 0) {
    reasons.push("No conditions specified — applies to all businesses");
  }

  return {
    obligationId: obligation.id,
    title: obligation.title,
    applies,
    reasons,
  };
}

/** Evaluate a full obligation list against one business, return only the ones that apply. */
export function getApplicableObligations(
  obligations: RegulatoryObligation[],
  business: Business
): PolicyEvaluationResult[] {
  return obligations
    .map((o) => evaluateObligation(o, business))
    .filter((r) => r.applies);
}

/** Evaluate everything and return results for all obligations, applicable or not —
 * useful for an admin "why doesn't X apply to me" debugging view. */
export function evaluateAllObligations(
  obligations: RegulatoryObligation[],
  business: Business
): PolicyEvaluationResult[] {
  return obligations.map((o) => evaluateObligation(o, business));
}