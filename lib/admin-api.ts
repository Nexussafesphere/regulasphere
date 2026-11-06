import { supabase } from "@/lib/supabase";
import {
  AdminDashboardStats,
  AdminFilters,
  SectorComplianceData,
  UserGrowthData,
  VerificationRequest,
} from "@/types/admin";

function getAdminClient() {
  return supabase;
}

async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const payload = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) throw new Error(payload?.error || `Admin request failed: ${response.status}`);
  return payload as T;
}

export const adminApi = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const result = await adminRequest<{ data: AdminDashboardStats }>("/api/admin/overview");
    return result.data;
  },

  async getUserGrowth(months: number = 6): Promise<UserGrowthData[]> {
    const result = await adminRequest<{ data: UserGrowthData[] }>(`/api/admin/reports?type=users&months=${months}`);
    return result.data.flat();
  },

  async getSectorCompliance(): Promise<SectorComplianceData[]> {
    const result = await adminRequest<{ data: SectorComplianceData[] }>("/api/admin/reports?type=compliance");
    return result.data;
  },

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    const { data, error } = await getAdminClient()
      .from("verification_requests")
      .select("*")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return (data || []) as VerificationRequest[];
  },

  async getUsers(filters: AdminFilters) {
    const { search, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = getAdminClient()
      .from("users")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async getBusinesses(filters: AdminFilters) {
    const { search, sector, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = getAdminClient()
      .from("businesses")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,rc_number.ilike.%${search}%,tin.ilike.%${search}%`);
    }

    if (sector) {
      query = query.eq("sector", sector);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async getConsultants(filters: AdminFilters) {
    const { search, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = getAdminClient()
      .from("consultants")
      .select(`
        *,
        users:user_id(email)
      `, { count: "exact" });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,users.email.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async getDocuments(filters: AdminFilters) {
    const { search, status, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = getAdminClient()
      .from("documents")
      .select(`
        *,
        businesses:business_id(business_name)
      `, { count: "exact" });

    if (search) {
      query = query.ilike("document_name", `%${search}%`);
    }

    if (status) {
      query = query.eq("verification_status", status);
    }

    const { data, error, count } = await query
      .order("upload_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async getObligations(filters: AdminFilters) {
    const { search, regulator, status, page, limit } = filters;
    const offset = (page - 1) * limit;

    let query = getAdminClient()
      .from("obligations")
      .select(`
        *,
        businesses:business_id(business_name)
      `, { count: "exact" });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (regulator) {
      query = query.eq("regulator", regulator);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query
      .order("deadline", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async updateUserStatus(userId: string, isActive: boolean) {
    const { data, error } = await getAdminClient()
      .from("users")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async verifyBusiness(businessId: string, approved: boolean) {
    const { data, error } = await getAdminClient()
      .from("businesses")
      .update({ 
        verification_status: approved ? "verified" : "rejected",
        updated_at: new Date().toISOString()
      })
      .eq("id", businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async verifyConsultant(consultantId: string, approved: boolean) {
    const { data, error } = await getAdminClient()
      .from("consultants")
      .update({ 
        is_verified: approved,
        updated_at: new Date().toISOString()
      })
      .eq("id", consultantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async reviewDocument(documentId: string, status: string, notes: string = "") {
    const { data, error } = await getAdminClient()
      .from("documents")
      .update({ 
        verification_status: status,
        verification_notes: notes,
        verification_date: new Date().toISOString()
      })
      .eq("id", documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createSystemAlert(alert: {
    title: string;
    message: string;
    alert_type: string;
    target_audience: string;
    start_date?: string;
    end_date?: string;
  }) {
    const { data, error } = await getAdminClient()
      .from("system_alerts")
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSystemAlert(alertId: string, updates: Record<string, unknown>) {
    const { data, error } = await getAdminClient()
      .from("system_alerts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAuditLogs(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;

    const { data, error, count } = await getAdminClient()
      .from("admin_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },
};