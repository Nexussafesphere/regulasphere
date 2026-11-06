export type AdminRole = "super_admin" | "admin" | "moderator";

export type AdminPermission =
  | "view_dashboard"
  | "manage_users"
  | "manage_businesses"
  | "manage_consultants"
  | "review_documents"
  | "manage_obligations"
  | "moderate_marketplace"
  | "view_reports"
  | "manage_alerts"
  | "manage_ai"
  | "view_audit_logs"
  | "manage_settings";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export type VerificationEntityType = "business" | "consultant" | "document";
export type VerificationStatus = "pending" | "approved" | "rejected" | "needs_review";
export type VerificationPriority = "low" | "normal" | "high" | "urgent";

export interface VerificationRequest {
  id: string;
  entity_type: VerificationEntityType;
  entity_id: string;
  entity_name: string | null;
  submitted_by: string | null;
  status: VerificationStatus;
  priority: VerificationPriority;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
}

export interface AdminActivity {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  activity_type: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type SystemAlertType = "info" | "warning" | "critical" | "success";
export type SystemAlertAudience = "all" | "business" | "consultant" | "regulator" | "admin";

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  alert_type: SystemAlertType;
  target_audience: SystemAlertAudience;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AITrainingReview {
  id: string;
  training_data_id: string | null;
  review_status: "pending" | "approved" | "rejected" | "needs_improvement";
  review_notes: string | null;
  accuracy_score: number | null;
  reviewed_by: string | null;
  reviewed_at: string;
  created_at: string;
}

export interface AdminDashboardStats {
  total_users: number;
  total_businesses: number;
  total_consultants: number;
  total_regulators: number;
  total_obligations: number;
  pending_verifications: number;
  active_documents: number;
  total_reports: number;
  active_alerts: number;
  avg_compliance_score: number;
}

export interface UserGrowthData {
  month: string;
  new_users: number;
  total_users: number;
}

export interface DocumentVerificationStats {
  status: string;
  count: number;
}

export interface SectorComplianceData {
  sector: string;
  total_businesses: number;
  compliant_businesses: number;
  avg_compliance_score: number;
}

export interface AdminUserManagement extends AdminUser {
  business_count?: number;
  document_count?: number;
  last_active?: string;
}

export interface BusinessManagementData {
  id: string;
  business_name: string;
  rc_number: string | null;
  tin: string | null;
  sector: string;
  state: string | null;
  employee_count: number;
  compliance_score: number;
  verification_status: string;
  created_at: string;
}

export interface ConsultantManagementData {
  id: string;
  full_name: string;
  email: string;
  specialization: string[];
  years_experience: number;
  is_verified: boolean;
  rating: number;
  total_assignments: number;
  created_at: string;
}

export interface DocumentReviewData {
  id: string;
  document_name: string;
  document_type: string;
  business_name: string;
  verification_status: string;
  upload_date: string;
  file_size: number;
  file_url: string;
}

export interface ObligationManagementData {
  id: string;
  title: string;
  regulator: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
  business_name: string;
  penalty: string | null;
}

export interface AdminFilters {
  search: string;
  status?: string;
  sector?: string;
  regulator?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}