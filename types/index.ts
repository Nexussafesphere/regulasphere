export type UserType = "Business" | "Consultant" | "Regulator";

export type Language = "English" | "Yoruba" | "Hausa" | "Igbo" | "Pidgin";

export type Regulator =
  | "NDPC"
  | "NITDA"
  | "CAC"
  | "FIRS"
  | "CBN"
  | "SEC"
  | "PENCOM"
  | "ITF"
  | "NSITF"
  | "NAFDAC";

export type Sector =
  | "Fintech"
  | "Healthcare"
  | "Manufacturing"
  | "Agriculture"
  | "Trading"
  | "Technology"
  | "Construction"
  | "Education"
  | "Other";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type ObligationStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Overdue"
  | "Under Review";

export type VerificationStatus =
  | "Pending"
  | "Verified"
  | "Rejected"
  | "Needs Review";

export type AssignmentStatus = "Active" | "Completed" | "Cancelled";

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";

export type ActivityType =
  | "Analysis"
  | "Alert"
  | "Recommendation"
  | "Risk Assessment"
  | "Document Check"
  | "Scan";

export type Category =
  | "CAC"
  | "Data Protection"
  | "AI Governance"
  | "Tax"
  | "Licensing"
  | "Pension"
  | "Employment";

export type DeadlineType =
  | "Fixed Date"
  | "Annual"
  | "Quarterly"
  | "Monthly"
  | "Ongoing"
  | "Before Activity";

export type PenaltyType = "Fixed" | "Percentage" | "Both" | "Daily";

export type DocumentType =
  | "CAC Certificate"
  | "Tax Clearance"
  | "NDPC Audit Report"
  | "AI Governance Policy"
  | "Pension Compliance"
  | "DPIA Report"
  | "Data Protection Policy"
  | "Privacy Notice"
  | "DPCO Agreement"
  | "Data Breach Notification"
  | "Consent Forms"
  | "Data Processing Agreement"
  | "Other";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  user_type: UserType;
  full_name: string;
  phone?: string;
  preferred_language: Language;
  email_verified: boolean;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
  preferred_language?: Language;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  rc_number?: string;
  tin?: string;
  sector: Sector;
  employee_count: number;
  annual_revenue?: "Under 25M" | "25M-100M" | "100M-500M" | "Over 500M";
  data_processing: boolean;
  data_subjects_count: number;
  has_sensitive_data: boolean;
  has_cross_border_transfer: boolean;
  has_data_protection_officer: boolean;
  dpco_engaged: boolean;
  dpco_name?: string;
  has_foreign_operations: boolean;
  is_fintech: boolean;
  uses_ai: boolean;
  ai_systems_description?: string;
  address?: string;
  state?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  business_name: string;
  sector: Sector;
  employee_count: number;
  annual_revenue?: string;
  data_processing: boolean;
  uses_ai: boolean;
  ai_systems_description?: string;
  is_fintech: boolean;
  has_foreign_operations: boolean;
  rc_number?: string;
  tin?: string;
}

export interface Consultant {
  id: string;
  user_id: string;
  full_name: string;
  specialization: Category[];
  years_experience: number;
  certifications: string[];
  dpco_license_number?: string;
  rating: number;
  total_reviews: number;
  bio?: string;
  profile_image_url?: string;
  availability: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Obligation {
  id: string;
  business_id: string;
  title: string;
  regulator: Regulator;
  description?: string;
  legal_basis?: string;
  deadline?: string;
  deadline_type?: DeadlineType;
  penalty?: string;
  penalty_type?: PenaltyType;
  penalty_amount?: string;
  category?: Category;
  priority: Priority;
  status: ObligationStatus;
  remediation_steps?: string[];
  ai_notes?: string;
  assigned_consultant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  business_id: string;
  obligation_id?: string;
  document_name: string;
  document_type?: DocumentType;
  file_url?: string;
  file_size?: number;
  file_mime_type?: string;
  upload_date: string;
  verification_status: VerificationStatus;
  verified_by?: string;
  verification_date?: string;
  verification_notes?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  title: string;
  regulator?: Regulator;
  summary?: string;
  action_required?: string;
  deadline?: string;
  affected_sectors?: Sector[];
  severity: AlertSeverity;
  is_ai_generated: boolean;
  source_url?: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  business_id: string;
  consultant_id: string;
  obligation_id?: string;
  status: AssignmentStatus;
  assigned_date: string;
  completed_date?: string;
  notes?: string;
}

export interface AgentActivity {
  id: string;
  business_id: string;
  activity_type: ActivityType;
  description: string;
  metadata?: Record<string, string | number | boolean | null>;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  business_id: string;
  user_message: string;
  ai_response: string;
  language_used: Language;
  context_used?: string;
  latency_ms?: number;
  created_at: string;
}

export interface ComplianceReport {
  id: string;
  business_id: string;
  report_date: string;
  overall_score: number;
  summary: string;
  recommendations: string[];
  verified_by_consultant: boolean;
  consultant_id?: string;
  report_url?: string;
  created_at: string;
}

export interface RegulatoryObligation {
  id: string;
  regulator: Regulator;
  title: string;
  description: string;
  legal_basis: string;
  deadline_type: DeadlineType;
  deadline_value: string;
  penalty: string;
  penalty_type: PenaltyType;
  penalty_amount?: string;
  category: Category;
  priority: Priority;
  remediation_steps: string[];
  applicable_sectors: Sector[];
  minimum_employees: number;
  trigger_conditions?: Record<string, boolean>;
  source_url?: string;
  source_document?: string;
  created_at: string;
  updated_at: string;
}

export interface SectorRequirement {
  id: string;
  sector: Sector;
  regulator: Regulator;
  requirement: string;
  legal_basis?: string;
  deadline?: string;
  penalty?: string;
  priority?: Priority;
  created_at: string;
}

export interface PenaltyStructure {
  id: string;
  regulator: Regulator;
  violation: string;
  fine_type: PenaltyType;
  fine_amount?: string;
  fine_percentage?: string;
  daily_amount?: string;
  legal_basis?: string;
  created_at: string;
}

export interface RegulatoryUpdate {
  id: string;
  regulator: Regulator;
  title: string;
  summary: string;
  action_required?: string;
  effective_date?: string;
  deadline_date?: string;
  affected_sectors?: Sector[];
  severity?: AlertSeverity;
  source_url?: string;
  is_ai_detected: boolean;
  detected_at: string;
  created_at: string;
}

export interface TrainingExample {
  id: string;
  prompt: string;
  completion: string;
  category?: string;
  language: Language;
  quality_score: number;
  is_validated: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_obligations: number;
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
  under_review: number;
  compliance_score: number;
  pending_documents: number;
}

export interface RiskAssessment {
  risk_level: "Critical" | "High" | "Medium" | "Low";
  risk_score: number;
  critical_issues: number;
  high_issues: number;
  overdue_count: number;
  ai_governance_gap: boolean;
  data_protection_gap: boolean;
}

export interface SectorComplianceStats {
  sector: Sector;
  total_businesses: number;
  compliant_businesses: number;
  avg_compliance_score: number;
}

export interface CommonViolation {
  category: Category;
  violation_count: number;
}

export interface RegulatorOverview {
  regulator: Regulator;
  total_obligations: number;
  completed: number;
  overdue: number;
  compliance_rate: number;
}

export interface MonthlyTrend {
  month: string;
  avg_score: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface ChatRequest {
  message: string;
  businessId?: string;
  businessContext?: BusinessProfile;
  language?: Language;
}

export interface ChatResponse {
  response: string;
  language_used?: Language;
}

export interface AnalyzeBusinessRequest {
  business: BusinessProfile;
}

export interface AnalyzeBusinessResponse {
  applicable_regulators: Regulator[];
  total_obligations: number;
  critical_obligations: number;
  high_priority: number;
  medium_priority: number;
  obligations: Obligation[];
  recommended_consultants: Array<{
    specialization: Category;
    reason: string;
  }>;
  risk_level: string;
  risk_score: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}