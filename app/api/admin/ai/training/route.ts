import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const userEmail = req.headers.get("x-regulasphere-user-email");

    if (!userEmail || !isAdminEmail(userEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      trainingDataId?: unknown;
      reviewStatus?: unknown;
    };
    if (
      typeof body.trainingDataId !== "string" ||
      (body.reviewStatus !== "approved" && body.reviewStatus !== "rejected")
    ) {
      return NextResponse.json(
        { error: "A training data ID and valid review status are required" },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabase
      .from("ai_training_reviews")
      .insert({
        training_data_id: body.trainingDataId,
        review_status: body.reviewStatus,
        reviewed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("ai_training_data")
      .update({ is_validated: body.reviewStatus === "approved" })
      .eq("id", body.trainingDataId);

    if (updateError) {
      await supabase.from("ai_training_reviews").delete().eq("id", review.id);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}