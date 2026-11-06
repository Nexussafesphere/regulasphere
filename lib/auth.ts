import { supabase } from "./supabase";

export type UserType = "Business" | "Consultant" | "Regulator";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
  preferred_language?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          user_type: data.user_type,
          phone: data.phone || null,
          preferred_language: "English",
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: "Registration failed. No user returned." };
    }

    const user: AuthUser = {
      id: authData.user.id,
      email: data.email,
      full_name: data.full_name,
      user_type: data.user_type,
      phone: data.phone,
      preferred_language: "English",
    };

    return { user, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return { user: null, error: message };
  }
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: "Login failed. No user returned." };
    }

    const userType = (authData.user.user_metadata?.user_type as UserType) || "Business";
    const fullName = authData.user.user_metadata?.full_name || authData.user.email || "User";

    const user: AuthUser = {
      id: authData.user.id,
      email: authData.user.email || "",
      full_name: fullName,
      user_type: userType,
      phone: authData.user.user_metadata?.phone,
      preferred_language: authData.user.user_metadata?.preferred_language || "English",
    };

    return { user, error: null };
  } catch (error: unknown) {
    console.error("Login exception:", error);
    const message = error instanceof Error ? error.message : "Login failed";
    return { user: null, error: message };
  }
}

export async function logoutUser(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return { error: message };
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) return null;

    const authUser = session.user;
    const userType = (authUser.user_metadata?.user_type as UserType) || "Business";
    const fullName = authUser.user_metadata?.full_name || authUser.email || "User";

    return {
      id: authUser.id,
      email: authUser.email || "",
      full_name: fullName,
      user_type: userType,
      phone: authUser.user_metadata?.phone,
      preferred_language: authUser.user_metadata?.preferred_language || "English",
    };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export async function hasUserType(requiredType: UserType): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.user_type === requiredType;
}

export async function requireAuth(): Promise<AuthUser | null> {
  return getCurrentUser();
}

export async function requireBusiness(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || user.user_type !== "Business") return null;
  return user;
}

export async function requireConsultant(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || user.user_type !== "Consultant") return null;
  return user;
}

export async function requireRegulator(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || user.user_type !== "Regulator") return null;
  return user;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    preferred_language?: string;
  }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return { success: false, error: message };
  }
}

export async function redirectBasedOnUserType(user: AuthUser): Promise<string> {
  switch (user.user_type) {
    case "Business":
      return "/dashboard";
    case "Consultant":
      return "/consultant";
    case "Regulator":
      return "/regulator";
    default:
      return "/";
  }
}

export async function getBusinessByUserId(
  userId: string
): Promise<{ business_id: string; business_name: string; sector: string } | null> {
  try {
    const { data, error } = await supabase
      .from("businesses")
      .select("id, business_name, sector")
      .eq("user_id", userId)
      .single();

    if (error) return null;

    return {
      business_id: data.id,
      business_name: data.business_name,
      sector: data.sector,
    };
  } catch {
    return null;
  }
}

export async function getConsultantByUserId(
  userId: string
): Promise<{ consultant_id: string; full_name: string } | null> {
  try {
    const { data, error } = await supabase
      .from("consultants")
      .select("id, full_name")
      .eq("user_id", userId)
      .single();

    if (error) return null;

    return {
      consultant_id: data.id,
      full_name: data.full_name,
    };
  } catch {
    return null;
  }
}

export async function completeBusinessOnboarding(
  userId: string,
  data: {
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
  }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from("businesses").insert({
      user_id: userId,
      business_name: data.business_name,
      rc_number: data.rc_number || null,
      tin: data.tin || null,
      sector: data.sector,
      employee_count: data.employee_count,
      annual_revenue: data.annual_revenue || null,
      data_processing: data.data_processing,
      has_foreign_operations: data.has_foreign_operations,
      is_fintech: data.is_fintech,
      uses_ai: data.uses_ai,
      ai_systems_description: data.ai_systems_description || null,
      address: data.address || null,
      state: data.state || null,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Onboarding failed";
    return { success: false, error: message };
  }
}

export async function completeConsultantOnboarding(
  userId: string,
  data: {
    full_name: string;
    specialization: string[];
    years_experience: number;
    certifications: string[];
    dpco_license_number?: string;
    bio?: string;
  }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from("consultants").insert({
      user_id: userId,
      full_name: data.full_name,
      specialization: data.specialization,
      years_experience: data.years_experience,
      certifications: data.certifications,
      dpco_license_number: data.dpco_license_number || null,
      bio: data.bio || null,
      availability: true,
      is_verified: false,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Consultant onboarding failed";
    return { success: false, error: message };
  }
}