export interface BusinessProfile {
  business_name: string;
  sector: string;
  employee_count: number;
  annual_revenue: string;
  data_processing: boolean;
  uses_ai: boolean;
  ai_systems_description?: string;
  is_fintech: boolean;
  has_foreign_operations: boolean;
  rc_number?: string;
  tin?: string;
}

export interface ComplianceObligation {
  title: string;
  regulator: string;
  category: string;
  deadline: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  description: string;
  legal_basis: string;
  penalty: string;
  remediation_steps: string[];
}

export function getApplicableRegulators(profile: BusinessProfile): string[] {
  const regulators = new Set<string>();

  regulators.add("CAC");

  if (profile.data_processing) {
    regulators.add("NDPC");
  }

  if (profile.uses_ai) {
    regulators.add("NITDA");
  }

  regulators.add("NRS");

  if (profile.is_fintech) {
    regulators.add("CBN");
    regulators.add("SEC");
  }

  if (profile.employee_count >= 15) {
    regulators.add("PENCOM");
  }

  if (profile.employee_count >= 25) {
    regulators.add("ITF");
  }

  if (profile.employee_count >= 5) {
    regulators.add("NSITF");
  }

  if (profile.sector === "Manufacturing" || profile.sector === "Healthcare") {
    regulators.add("NAFDAC");
  }

  return Array.from(regulators);
}

export function getSectorSpecificObligations(sector: string): string[] {
  const obligations: Record<string, string[]> = {
    Fintech: [
      "CBN Payment Service Provider License",
      "SEC VASP Registration",
      "AML/CFT Reporting",
      "Data Protection Audit",
      "AI Governance Compliance",
    ],
    Healthcare: [
      "DPIA for Patient Data",
      "Sensitive Data Protection",
      "NAFDAC Product Registration",
      "Employee Compensation Scheme",
    ],
    Manufacturing: [
      "NAFDAC Product Registration",
      "NSITF Employee Compensation",
      "ITF Skills Development Levy",
      "VAT Registration",
    ],
    Agriculture: [
      "NAFDAC Processed Food Registration",
      "NSITF Farm Worker Compensation",
      "CAC Business Registration",
    ],
    Trading: [
      "VAT Registration",
      "CAC Business Registration",
      "WHT Remittance",
    ],
    Technology: [
      "AI Governance Compliance",
      "Data Protection Audit",
      "Cybersecurity Compliance",
    ],
    Construction: [
      "NSITF Worker Compensation",
      "ITF Skills Development Levy",
    ],
    Education: [
      "Student Data Protection",
      "CAC Business Registration",
    ],
  };

  return obligations[sector] || ["CAC Annual Returns", "NRS Tax Filing"];
}

export function calculateRiskScore(
  obligations: ComplianceObligation[]
): number {
  let score = 0;

  for (const ob of obligations) {
    switch (ob.priority) {
      case "Critical":
        score += 20;
        break;
      case "High":
        score += 10;
        break;
      case "Medium":
        score += 5;
        break;
      default:
        break;
    }
  }

  return Math.min(score, 100);
}

export function getRiskLevel(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 80) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}