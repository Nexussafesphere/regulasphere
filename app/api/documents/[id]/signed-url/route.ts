import { NextRequest, NextResponse } from "next/server";
import { adminGetDocument, adminGetSignedDocumentUrl } from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await adminGetDocument(id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!(await canAccessBusiness(req, document.business_id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!document.file_url) {
      return NextResponse.json({ error: "No file attached to this document" }, { status: 404 });
    }

    const url = await adminGetSignedDocumentUrl(document.file_url, 300); // 5 min expiry
    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}