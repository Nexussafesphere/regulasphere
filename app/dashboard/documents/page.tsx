"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Upload,
  FileText,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import DocumentUpload from "@/components/documents/DocumentUpload";

interface DocumentItem {
  id: string;
  business_id: string;
  document_name: string;
  document_type?: string;
  file_url?: string;
  upload_date?: string;
  verification_status: string;
  verified_by?: string;
  verification_date?: string;
  verification_notes?: string;
}

const DOCUMENT_TYPES = [
  "All",
  "CAC Certificate",
  "Tax Clearance",
  "NDPC Audit Report",
  "AI Governance Policy",
  "Pension Compliance",
  "DPIA Report",
  "Other",
];

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Verified",
  "Rejected",
  "Needs Review",
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<{
    documentId: string;
    message: string;
  } | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const resolveBusinessId = useCallback(async (): Promise<string> => {
    if (businessId) return businessId;
    const bizRes = await fetch("/api/businesses");
    if (!bizRes.ok) throw new Error("Failed to resolve business");
    const { business } = await bizRes.json();
    if (!business) throw new Error("No business profile found");
    setBusinessId(business.id);
    return business.id;
  }, [businessId]);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const id = await resolveBusinessId();
      const res = await fetch(`/api/documents?businessId=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to load documents");
      const { documents: data } = await res.json();
      setDocuments(data as DocumentItem[]);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [resolveBusinessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadDocuments();
    }
  }, [loadDocuments]);

  const handleViewDownload = async (documentId: string) => {
    setDownloadingId(documentId);
    setDownloadError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/signed-url`);
      const body = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !body.url) {
        throw new Error(body.error || "Failed to get file URL");
      }
      const { url } = body;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error: unknown) {
      setDownloadError({
        documentId,
        message: error instanceof Error ? error.message : "Unable to open this document",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = documents.filter((doc) => {
    const matchesType =
      typeFilter === "All" || doc.document_type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || doc.verification_status === statusFilter;
    const matchesSearch = doc.document_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return "badge badge-gold";
      case "Rejected":
        return "badge badge-silver";
      case "Needs Review":
        return "badge badge-outline";
      default:
        return "badge badge-silver";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              Documents
            </h1>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary btn-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Upload className="w-4 h-4 shrink-0" /> Upload Document
          </button>
        </div>

        {loadError && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{loadError}</span>
            <button type="button" onClick={loadDocuments} className="underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 w-full">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents..."
              className="input pl-10 w-full text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select flex-1 sm:w-40 text-sm"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select flex-1 sm:w-36 text-sm"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
          {filtered.map((doc) => (
            <div key={doc.id} className="card w-full">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {doc.document_name}
                    </h3>
                    <p className="text-xs text-muted truncate">
                      {doc.document_type || "Other"}
                    </p>
                  </div>
                </div>
                <span className={`${getStatusBadge(doc.verification_status)} shrink-0`}>
                  {doc.verification_status}
                </span>
              </div>

              <p className="text-xs text-muted mb-3">
                Uploaded: {doc.upload_date || "Unknown"}
              </p>

              {doc.verification_notes && (
                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  {doc.verification_notes}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDownload(doc.id)}
                  disabled={downloadingId === doc.id || !doc.file_url}
                  className="btn btn-secondary btn-sm flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3 h-3 shrink-0" />
                  {downloadingId === doc.id ? "Loading..." : "View"}
                </button>
                <button
                  onClick={() => handleViewDownload(doc.id)}
                  disabled={downloadingId === doc.id || !doc.file_url}
                  className="btn btn-secondary btn-sm flex items-center gap-1 text-xs"
                >
                  <Download className="w-3 h-3 shrink-0" />
                  {downloadingId === doc.id ? "Loading..." : "Download"}
                </button>
              </div>
              {downloadError?.documentId === doc.id && (
                <p role="alert" className="mt-3 text-xs text-red-600">
                  {downloadError.message}
                </p>
              )}
            </div>
          ))}
          {filtered.length === 0 && !loadError && (
            <div className="col-span-1 lg:col-span-2 text-center py-12 w-full">
              <FileText className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No documents found.</p>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && businessId && (
        <DocumentUpload
          businessId={businessId}
          documentTypes={DOCUMENT_TYPES.filter((t) => t !== "All")}
          onSuccess={loadDocuments}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}