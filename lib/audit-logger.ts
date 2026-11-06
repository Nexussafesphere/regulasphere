import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

interface AuditLogEntry {
  adminId?: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const client = getAdminClient();
    const { error } = await client.from("admin_audit_logs").insert({
      admin_id: entry.adminId || null,
      admin_email: entry.adminEmail,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId || null,
      entity_name: entry.entityName || null,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
      user_agent: entry.userAgent || null,
    });

    if (error) {
      console.error("Failed to log audit event:", error);
    }
  } catch (error) {
    console.error("Audit logging error:", error);
  }
}

export async function getAuditLogs(limit: number = 100, offset: number = 0) {
  const client = getAdminClient();
  const { data, error, count } = await client
    .from("admin_audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return { data, count };
}

export async function logAdminActivity(
  adminEmail: string,
  activityType: string,
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const client = getAdminClient();
    
    const { data: adminUser } = await client
      .from("admin_users")
      .select("id")
      .eq("email", adminEmail)
      .single();

    const { error } = await client.from("admin_activities").insert({
      admin_id: adminUser?.id || null,
      admin_email: adminEmail,
      activity_type: activityType,
      description,
      metadata: metadata || {},
    });

    if (error) {
      console.error("Failed to log admin activity:", error);
    }
  } catch (error) {
    console.error("Admin activity logging error:", error);
  }
}