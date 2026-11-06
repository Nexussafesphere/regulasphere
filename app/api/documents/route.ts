import { NextRequest, NextResponse } from "next/server";
import {
  adminGetDocuments,
  adminVerifyDocument,
  adminUploadDocumentFile,
  adminCreateDocument
} from "@/lib/supabase-admin";
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

    const documents = await adminGetDocuments(businessId);

    return NextResponse.json({ documents });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch documents";
    console.error("Documents Error:", message);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const businessId = formData.get("businessId") as string | null;
    const documentName = formData.get("documentName") as string | null;
    const documentType = formData.get("documentType") as string | null;
    const obligationId = formData.get("obligationId") as string | null;

    if (!businessId || !documentName || !file) {
      return NextResponse.json(
        { error: "businessId, documentName, and file are required" },
        { status: 400 }
      );
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Basic file guardrails
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storagePath = await adminUploadDocumentFile(
      businessId,
      file.name,
      buffer,
      file.type || "application/octet-stream"
    );

    const document = await adminCreateDocument({
      business_id: businessId,
      document_name: documentName,
      document_type: documentType || "Other",
      obligation_id: obligationId || undefined,
      file_path: storagePath,
    });

    return NextResponse.json({ document });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload document";
    console.error("Document Upload Error:", message);
    return NextResponse.json(
      { error: "Failed to upload document", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-regulasphere-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, status, notes } = body;

    if (!documentId || !status) {
      return NextResponse.json(
        { error: "documentId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Verified", "Rejected", "Needs Review"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // The verifier is whoever is actually authenticated — not a client-supplied ID.
    // (Confirming this caller is a real consultant, not just any logged-in user,
    // needs a consultants-table lookup — see note below.)
    const document = await adminVerifyDocument(documentId, userId, status, notes);

    return NextResponse.json({ document });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to verify document";
    console.error("Document Verification Error:", message);
    return NextResponse.json(
      { error: "Failed to verify document", details: message },
      { status: 500 }
    );
  }
}
