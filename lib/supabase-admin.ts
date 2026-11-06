import "server-only";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let adminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    if (!supabaseServiceRoleKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in environment variables");
    }

    adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

interface User {
  id: string;
  email: string;
  user_type: "Business" | "Consultant" | "Regulator";
  full_name: string;
  phone?: string;
  preferred_language?: string;
  created_at?: string;
}

interface Business {
  id: string;
  user_id: string;
  business_name: string;
  rc_number?: string;
  tin?: string;
  sector: string;
  employee_count: number;
  annual_revenue?: string;
  data_processing: boolean;
  has_foreign_operations: boolean;
  is_fintech: boolean;
  uses_ai: boolean;
  ai_systems_description?: string;
  address?: string;
  state?: string;
  created_at?: string;
}

interface Consultant {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string[];
  years_experience: number;
  certifications: string[];
  dpco_license_number?: string;
  rating: number;
  total_reviews: number;
  bio?: string;
  profile_image_url?: string;
  availability: boolean;
  is_verified: boolean;
  created_at?: string;
}

interface Obligation {
  id?: string;
  business_id: string;
  title: string;
  regulator: string;
  description?: string;
  legal_basis?: string;
  deadline?: string;
  penalty?: string;
  category?: string;
  priority?: string;
  status?: string;
  remediation_steps?: string[];
  ai_notes?: string;
  assigned_consultant_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Document {
  id: string;
  business_id: string;
  obligation_id?: string;
  document_name: string;
  document_type?: string;
  file_url?: string;
  upload_date?: string;
  verification_status: "Pending" | "Verified" | "Rejected" | "Needs Review";
  verified_by?: string;
  verification_date?: string;
  verification_notes?: string;
}

interface Alert {
  id?: string;
  title: string;
  regulator?: string;
  summary?: string;
  action_required?: string;
  deadline?: string;
  affected_sectors?: string[];
  severity?: string;
  is_ai_generated?: boolean;
  source_url?: string;
}

interface Assignment {
  id?: string;
  business_id: string;
  consultant_id: string;
  obligation_id?: string;
  status: "Active" | "Completed" | "Cancelled";
  assigned_date?: string;
  completed_date?: string;
  notes?: string;
}

interface ChatLog {
  id?: string;
  business_id: string;
  user_message: string;
  ai_response: string;
  language_used: string;
  context_used?: string;
}

interface ComplianceReport {
  id?: string;
  business_id: string;
  overall_score: number;
  summary: string;
  recommendations: string[];
  verified_by_consultant?: boolean;
  consultant_id?: string;
  pdf_path?: string;
}

interface AgentActivity {
  id?: string;
  business_id: string;
  activity_type: string;
  description: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export async function adminGetUser(userId: string): Promise<User | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as User | null;
}

export async function adminGetAllUsers(userType?: string): Promise<User[]> {
  const client = getAdminClient();

  let query = client.from("users").select("*");

  if (userType) {
    query = query.eq("user_type", userType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as User[];
}

export async function adminGetBusiness(businessId: string): Promise<Business | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (error) throw error;
  return data as Business | null;
}

export async function adminGetAllBusinesses(): Promise<Business[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Business[];
}

export async function adminGetConsultants(): Promise<Consultant[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("consultants")
    .select("*")
    .order("rating", { ascending: false });

  if (error) throw error;
  return (data || []) as Consultant[];
}

export async function adminGetObligations(businessId?: string): Promise<Obligation[]> {
  const client = getAdminClient();

  let query = client.from("obligations").select("*");

  if (businessId) {
    query = query.eq("business_id", businessId);
  }

  const { data, error } = await query.order("deadline", { ascending: true });

  if (error) throw error;
  return (data || []) as Obligation[];
}

export async function adminGetDocuments(businessId?: string): Promise<Document[]> {
  const client = getAdminClient();

  let query = client.from("documents").select("*");

  if (businessId) {
    query = query.eq("business_id", businessId);
  }

  const { data, error } = await query.order("upload_date", { ascending: false });

  if (error) throw error;
  return (data || []) as Document[];
}

export async function adminGetAlerts(): Promise<Alert[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Alert[];
}

export async function adminCreateObligation(
  obligation: Obligation
): Promise<Obligation | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("obligations")
    .insert(obligation)
    .select()
    .single();

  if (error) throw error;
  return data as Obligation | null;
}

export async function adminUpdateObligation(
  obligationId: string,
  updates: Partial<Obligation>
): Promise<Obligation | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("obligations")
    .update(updates)
    .eq("id", obligationId)
    .select()
    .single();

  if (error) throw error;
  return data as Obligation | null;
}

export async function adminDeleteObligation(obligationId: string): Promise<boolean> {
  const client = getAdminClient();
  const { error } = await client
    .from("obligations")
    .delete()
    .eq("id", obligationId);

  if (error) throw error;
  return true;
}

export async function adminVerifyDocument(
  documentId: string,
  consultantId: string,
  status: "Verified" | "Rejected" | "Needs Review",
  notes?: string
): Promise<Document | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("documents")
    .update({
      verification_status: status,
      verified_by: consultantId,
      verification_date: new Date().toISOString(),
      verification_notes: notes || null,
    })
    .eq("id", documentId)
    .select()
    .single();

  if (error) throw error;
  return data as Document | null;
}

export async function adminCreateAlert(alert: Alert): Promise<Alert | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("alerts")
    .insert(alert)
    .select()
    .single();

  if (error) throw error;
  return data as Alert | null;
}

export async function adminCreateAssignment(
  businessId: string,
  consultantId: string,
  obligationId?: string
): Promise<Assignment | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("consultant_assignments")
    .insert({
      business_id: businessId,
      consultant_id: consultantId,
      obligation_id: obligationId || null,
      status: "Active",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Assignment | null;
}

export async function adminUpdateAssignmentStatus(
  assignmentId: string,
  status: "Active" | "Completed" | "Cancelled"
): Promise<Assignment | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("consultant_assignments")
    .update({
      status,
      completed_date: status === "Completed" ? new Date().toISOString() : null,
    })
    .eq("id", assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data as Assignment | null;
}

export async function adminSaveChatLog(
  businessId: string,
  userMessage: string,
  aiResponse: string,
  language: string,
  contextUsed?: string
): Promise<ChatLog | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("chat_logs")
    .insert({
      business_id: businessId,
      user_message: userMessage,
      ai_response: aiResponse,
      language_used: language,
      context_used: contextUsed || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ChatLog | null;
}

export async function adminGetChatLogs(businessId: string): Promise<ChatLog[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("chat_logs")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as ChatLog[];
}

export async function adminCreateComplianceReport(
  businessId: string,
  score: number,
  summary: string,
  recommendations: string[]
): Promise<ComplianceReport | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("compliance_reports")
    .insert({
      business_id: businessId,
      overall_score: score,
      summary,
      recommendations,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ComplianceReport | null;
}

export async function adminGetComplianceReports(
  businessId: string
): Promise<ComplianceReport[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("compliance_reports")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as ComplianceReport[];
}

export async function adminLogAgentActivity(
  businessId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, string | number | boolean | null>
): Promise<AgentActivity | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("agent_activities")
    .insert({
      business_id: businessId,
      activity_type: activityType,
      description,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data as AgentActivity | null;
}

export async function adminGetAgentActivities(
  businessId: string
): Promise<AgentActivity[]> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("agent_activities")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data || []) as AgentActivity[];
}

export async function adminGetSectorComplianceStats(): Promise<
  Array<{
    sector: string;
    total_businesses: number;
    compliant_businesses: number;
    avg_compliance_score: number;
  }>
> {
  const client = getAdminClient();
  const { data, error } = await client.rpc("get_sector_compliance_stats");

  if (error) throw error;
  return (data || []) as Array<{
    sector: string;
    total_businesses: number;
    compliant_businesses: number;
    avg_compliance_score: number;
  }>;
}

export async function adminGetCommonViolations(): Promise<
  Array<{ category: string; violation_count: number }>
> {
  const client = getAdminClient();
  const { data, error } = await client.rpc("get_common_violations");

  if (error) throw error;
  return (data || []) as Array<{ category: string; violation_count: number }>;
}

export async function adminGetRegulatorOverview(): Promise<
  Array<{
    regulator: string;
    total_obligations: number;
    completed: number;
    overdue: number;
    compliance_rate: number;
  }>
> {
  const client = getAdminClient();
  const { data, error } = await client.rpc("get_regulator_compliance_overview");

  if (error) throw error;
  return (data || []) as Array<{
    regulator: string;
    total_obligations: number;
    completed: number;
    overdue: number;
    compliance_rate: number;
  }>;
}

export async function adminGetMonthlyTrend(
  months: number = 6
): Promise<Array<{ month: string; avg_score: number }>> {
  const client = getAdminClient();
  const { data, error } = await client.rpc("get_monthly_compliance_trend", {
    p_months: months,
  });

  if (error) throw error;
  return (data || []) as Array<{ month: string; avg_score: number }>;
}

export async function adminGetBusinessRiskAssessment(
  businessId: string
): Promise<{
  risk_level: string;
  risk_score: number;
  critical_issues: number;
  high_issues: number;
  overdue_count: number;
} | null> {
  const client = getAdminClient();
  const { data, error } = await client.rpc("get_business_risk_assessment", {
    p_business_id: businessId,
  });

  if (error) throw error;
  return (data?.[0] || null) as {
    risk_level: string;
    risk_score: number;
    critical_issues: number;
    high_issues: number;
    overdue_count: number;
  } | null;
}

export async function adminGetPendingDocumentsForConsultant(
  consultantId: string
): Promise<Document[]> {
  const client = getAdminClient();
  const { data, error } = await client.rpc(
    "get_pending_documents_for_consultant",
    { p_consultant_id: consultantId }
  );

  if (error) throw error;
  return (data || []) as Document[];
}

export async function adminGetObligation(obligationId: string): Promise<Obligation | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("obligations")
    .select("*")
    .eq("id", obligationId)
    .single();

  if (error) throw error;
  return data as Obligation | null;
}
export async function adminCreateBusiness(
  business: Omit<Business, "id" | "created_at">
): Promise<Business | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("businesses")
    .insert(business)
    .select()
    .single();

  if (error) throw error;
  return data as Business | null;
}

export async function adminGetBusinessByUserId(userId: string): Promise<Business | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Business | null;
}

export async function adminUploadDocumentFile(
  businessId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const client = getAdminClient();
  const storagePath = `${businessId}/${Date.now()}-${fileName}`;

  const { error } = await client.storage
    .from("business-documents")
    .upload(storagePath, fileBuffer, { contentType, upsert: false });

  if (error) throw error;
  return storagePath;
}

export async function adminGetSignedDocumentUrl(
  storagePath: string,
  expiresInSeconds: number = 300
): Promise<string> {
  const client = getAdminClient();
  const { data, error } = await client.storage
    .from("business-documents")
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}
export async function adminGetPendingVerificationQueue(): Promise<Array<Document & { business_name: string }>> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("documents")
    .select("*, businesses(business_name)")
    .eq("verification_status", "Pending")
    .order("upload_date", { ascending: true });

  if (error) throw error;
  return (data || []).map((d: Document & { businesses?: { business_name?: string } }) => ({
    ...d,
    business_name: d.businesses?.business_name || "Unknown",
  }));
}

export async function adminCreateDocument(document: {
  business_id: string;
  document_name: string;
  document_type?: string;
  obligation_id?: string;
  file_path: string;
}): Promise<Document | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("documents")
    .insert({
      business_id: document.business_id,
      document_name: document.document_name,
      document_type: document.document_type || "Other",
      obligation_id: document.obligation_id || null,
      file_url: document.file_path, // storage PATH, not a public URL — resolved via signed URL on read
      verification_status: "Pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Document | null;
}

export async function adminGetDocument(documentId: string): Promise<Document | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error) throw error;
  return data as Document | null;
}
export async function adminGetComplianceReport(reportId: string): Promise<ComplianceReport | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("compliance_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error) throw error;
  return data as ComplianceReport | null;
}

export async function adminUploadReportPdf(
  businessId: string,
  reportId: string,
  pdfBuffer: Buffer
): Promise<string> {
  const client = getAdminClient();
  const storagePath = `${businessId}/${reportId}.pdf`;

  const { error } = await client.storage
    .from("compliance-reports")
    .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (error) throw error;
  return storagePath;
}

export async function adminUpdateReportPdfPath(
  reportId: string,
  pdfPath: string
): Promise<ComplianceReport | null> {
  const client = getAdminClient();
  const { data, error } = await client
    .from("compliance_reports")
    .update({ pdf_path: pdfPath })
    .eq("id", reportId)
    .select()
    .single();

  if (error) throw error;
  return data as ComplianceReport | null;
}

export async function adminGetSignedReportUrl(
  storagePath: string,
  expiresInSeconds: number = 300
): Promise<string> {
  const client = getAdminClient();
  const { data, error } = await client.storage
    .from("compliance-reports")
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}