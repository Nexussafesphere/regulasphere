"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Calendar, Building2, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface DocumentDetail {
  id: string;
  document_name: string;
  document_type: string;
  business_name: string;
  verification_status: string;
  upload_date: string;
  file_size: number;
  file_url: string;
  verification_notes: string | null;
  verification_date: string | null;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const { data } = await adminApi.getDocuments({ search: "", page: 1, limit: 100 });
        const foundDocument = (data || []).find((d: DocumentDetail) => d.id === documentId);
        setDocument(foundDocument || null);
      } catch (error) {
        console.error("Failed to fetch document:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDocument();
  }, [documentId]);

  const handleReview = async (status: string) => {
    if (!document) return;
    try {
      await adminApi.reviewDocument(document.id, status, reviewNotes);
      setDocument({
        ...document,
        verification_status: status,
        verification_notes: reviewNotes,
        verification_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to review document:", error);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-lg mx-auto" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="card text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
          <FileText className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">Document Not Found</h3>
        <p className="text-muted text-sm">The requested document does not exist.</p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
      case "Rejected":
        return "bg-red-50 text-red-700 ring-red-100";
      case "Needs Review":
        return "bg-orange-50 text-orange-700 ring-orange-100";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-navy truncate">{document.document_name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{document.document_type}</span>
              <span>· {formatFileSize(document.file_size)}</span>
            </div>
          </div>
        </div>
        {document.file_url && (
          <a href={document.file_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <Download className="w-4 h-4 inline mr-2" />
            Download
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Document Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Business</p>
                <p className="text-sm text-muted">{document.business_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Upload Date</p>
                <p className="text-sm text-muted">{new Date(document.upload_date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy mb-1">Status</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getStatusBadge(document.verification_status)}`}>
                  {document.verification_status}
                </span>
              </div>
            </div>
            {document.verification_date && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy">Verification Date</p>
                  <p className="text-sm text-muted">{new Date(document.verification_date).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Review Document</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                className="input"
                placeholder="Add review notes..."
              />
            </div>
            {document.verification_notes && (
              <div>
                <p className="text-sm font-medium text-navy mb-1">Existing Notes</p>
                <p className="text-sm text-muted">{document.verification_notes}</p>
              </div>
            )}
            {document.verification_status === "Pending" && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleReview("Verified")}
                  className="btn-primary bg-emerald-600! hover:bg-emerald-700! flex-1"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleReview("Needs Review")}
                  className="btn-outline border-orange-500! text-orange-600! hover:bg-orange-50! flex-1"
                >
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Needs Review
                </button>
                <button
                  onClick={() => handleReview("Rejected")}
                  className="btn-outline border-red-600! text-red-600! hover:bg-red-50! flex-1"
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}