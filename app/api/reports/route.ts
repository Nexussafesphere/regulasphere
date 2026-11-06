import {
  adminUploadReportPdf,
  adminUpdateReportPdfPath,
} from "@/lib/supabase-admin";
import { generateReportPdf } from "@/lib/report-pdf";
import { NextRequest, NextResponse } from "next/server";
import {
  adminGetObligations,
  adminGetDocuments,
  adminGetBusiness,
  adminGetBusinessRiskAssessment,
  adminCreateComplianceReport,
  adminGetComplianceReports,
} from "@/lib/supabase-admin";
import { chatCompletion, NVIDIA_SYSTEM_PROMPT } from "@/lib/nvidia";
import { canAccessBusiness } from "@/lib/tenant-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await adminGetComplianceReports(businessId);

    return NextResponse.json({ reports });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch reports";
    console.error("Reports Error:", message);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, reportType = "Monthly Summary" } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [business, obligations, documents, risk] = await Promise.all([
      adminGetBusiness(businessId),
      adminGetObligations(businessId),
      adminGetDocuments(businessId),
      adminGetBusinessRiskAssessment(businessId),
    ]);

    const completed = obligations.filter((o) => o.status === "Completed").length;
    const total = obligations.length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    const prompt = `Generate a compliance report summary for:
Business: ${business?.business_name || "Unknown"}
Sector: ${business?.sector || "Unknown"}
Score: ${score}%
Risk Level: ${risk?.risk_level || "Low"}
Total Obligations: ${total}
Completed: ${completed}
Overdue: ${obligations.filter((o) => o.status === "Overdue").length}
Pending Documents: ${documents.filter((d) => d.verification_status === "Pending").length}

Report Type: ${reportType}

Provide a concise summary and list of recommendations.`;

    const aiSummary = await chatCompletion(
      [
        { role: "system", content: NVIDIA_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      { temperature: 0.2, maxTokens: 1000 }
    );

    const recommendations = obligations
      .filter((o) => o.status === "Overdue" || o.status === "Pending")
      .slice(0, 5)
      .map((o) => o.title);

    const report = await adminCreateComplianceReport(
      businessId,
      score,
      aiSummary,
      recommendations
    );

    if (!report?.id) {
      return NextResponse.json({ error: "Failed to create report record" }, { status: 500 });
    }

    // Generate the actual PDF and store it — this is the "print/download" artifact
    const pdfBuffer = await generateReportPdf({
      businessName: business?.business_name || "Unknown Business",
      sector: business?.sector || "Unknown",
      reportDate: new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      reportType,
      overallScore: score,
      riskLevel: risk?.risk_level,
      summary: aiSummary,
      recommendations,
      totalObligations: total,
      completedObligations: completed,
      overdueObligations: obligations.filter((o) => o.status === "Overdue").length,
    });

    const pdfPath = await adminUploadReportPdf(businessId, report.id, pdfBuffer);
    const updatedReport = await adminUpdateReportPdfPath(report.id, pdfPath);

    return NextResponse.json({ report: updatedReport || report });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate report";
    console.error("Report Generation Error:", message);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}