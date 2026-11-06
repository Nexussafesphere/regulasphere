import { NextRequest, NextResponse } from "next/server";
import { adminGetComplianceReport, adminGetSignedReportUrl } from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await adminGetComplianceReport(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (!(await canAccessBusiness(req, report.business_id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!report.pdf_path) {
      return NextResponse.json({ error: "PDF not yet generated for this report" }, { status: 404 });
    }

    const url = await adminGetSignedReportUrl(report.pdf_path, 300);
    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error("Report signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}