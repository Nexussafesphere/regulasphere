import { NextRequest } from "next/server";
import { adminGetBusiness, adminGetObligation } from "@/lib/supabase-admin";
import { getApiUser } from "@/lib/api-auth";
import { isAdminEmail } from "@/lib/admin-auth";

export async function canAccessBusiness(
  req: NextRequest,
  businessId: string
): Promise<boolean> {
  const user = await getApiUser(req);
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;

  const business = await adminGetBusiness(businessId);
  return business?.user_id === user.id;
}

export async function canAccessObligation(
  req: NextRequest,
  obligationId: string
): Promise<boolean> {
  const obligation = await adminGetObligation(obligationId);
  return obligation?.business_id
    ? canAccessBusiness(req, obligation.business_id)
    : false;
}
