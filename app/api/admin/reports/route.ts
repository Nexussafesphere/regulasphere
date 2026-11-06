import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const userEmail = req.headers.get("x-regulasphere-user-email");

    if (!userEmail || !isAdminEmail(userEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type");

    let data;
    let error;

    switch (reportType) {
      case "users": {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("created_at")
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: true });

        if (usersError) {
          error = usersError;
          break;
        }

        const monthlyCounts = new Map<string, number>();
        for (const user of users || []) {
          const month = new Date(user.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          monthlyCounts.set(month, (monthlyCounts.get(month) || 0) + 1);
        }

        let totalUsers = 0;
        data = Array.from(monthlyCounts, ([month, newUsers]) => {
          totalUsers += newUsers;
          return { month, new_users: newUsers, total_users: totalUsers };
        });
        break;
      }
      case "compliance":
        ({ data, error } = await supabase.rpc("get_sector_compliance_stats"));
        break;
      case "violations":
        ({ data, error } = await supabase.rpc("get_common_violations"));
        break;
      default:
        ({ data, error } = await supabase.rpc("get_admin_dashboard_stats"));
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}