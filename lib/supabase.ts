import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange((_event, session) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    const cookieOptions = `Path=/; SameSite=Lax${secure}`;

    if (!session) {
      document.cookie = `sb-access-token=; ${cookieOptions}; Max-Age=0`;
      document.cookie = `sb-refresh-token=; ${cookieOptions}; Max-Age=0`;
      return;
    }

    const accessMaxAge = session.expires_at
      ? Math.max(0, session.expires_at - Math.floor(Date.now() / 1000))
      : 3600;
    document.cookie = `sb-access-token=${session.access_token}; ${cookieOptions}; Max-Age=${accessMaxAge}`;
    document.cookie = `sb-refresh-token=${session.refresh_token}; ${cookieOptions}; Max-Age=604800`;
  });
}

// ... rest of your functions unchanged

export async function getBusinessProfile(userId: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getBusinessObligations(businessId: string) {
  const { data, error } = await supabase
    .from("obligations")
    .select("*")
    .eq("business_id", businessId)
    .order("deadline", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getComplianceScore(businessId: string) {
  const { data, error } = await supabase
    .rpc("calculate_compliance_score", { p_business_id: businessId });

  if (error) throw error;
  return data;
}

export async function getUpcomingDeadlines(businessId: string, days: number = 30) {
  const { data, error } = await supabase
    .rpc("get_upcoming_deadlines", {
      p_business_id: businessId,
      p_days: days,
    });

  if (error) throw error;
  return data;
}

export async function getBusinessDocuments(businessId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("business_id", businessId)
    .order("upload_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRegulatoryAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function getConsultantsBySpecialization(specialization?: string) {
  let query = supabase.from("consultants").select("*");

  if (specialization && specialization !== "All") {
    query = query.contains("specialization", [specialization]);
  }

  const { data, error } = await query.order("rating", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveChatLog(
  businessId: string,
  userMessage: string,
  aiResponse: string,
  language: string
) {
  const { data, error } = await supabase
    .from("chat_logs")
    .insert({
      business_id: businessId,
      user_message: userMessage,
      ai_response: aiResponse,
      language_used: language,
    });

  if (error) throw error;
  return data;
}

export async function saveObligation(
  businessId: string,
  obligation: {
    title: string;
    regulator: string;
    description?: string;
    legal_basis?: string;
    deadline?: string;
    penalty?: string;
    category?: string;
    priority?: string;
    remediation_steps?: string[];
  }
) {
  const { data, error } = await supabase
    .from("obligations")
    .insert({
      business_id: businessId,
      title: obligation.title,
      regulator: obligation.regulator,
      description: obligation.description,
      legal_basis: obligation.legal_basis,
      deadline: obligation.deadline,
      penalty: obligation.penalty,
      category: obligation.category,
      priority: obligation.priority,
      status: "Pending",
      remediation_steps: obligation.remediation_steps,
    });

  if (error) throw error;
  return data;
}

export async function updateObligationStatus(
  obligationId: string,
  status: string
) {
  const { data, error } = await supabase
    .from("obligations")
    .update({ status })
    .eq("id", obligationId);

  if (error) throw error;
  return data;
}

export async function uploadDocument(
  businessId: string,
  documentName: string,
  documentType: string,
  obligationId?: string
) {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      business_id: businessId,
      document_name: documentName,
      document_type: documentType,
      obligation_id: obligationId || null,
      verification_status: "Pending",
    });

  if (error) throw error;
  return data;
}