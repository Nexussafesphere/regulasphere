"use client";

import { FileText, Download, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = -1;

  do {
    size /= 1024;
    unitIndex += 1;
  } while (size >= 1024 && unitIndex < units.length - 1);

  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`;
};

interface DocumentReviewCardProps {
  document: {
    id: string;
    document_name: string;
    document_type: string;
    business_name: string;
    verification_status: string;
    upload_date: string;
    file_size: number;
    file_url: string;
  };
  onReview?: (documentId: string, status: string) => void;
  onViewDetails?: (documentId: string) => void;
}

export default function DocumentReviewCard({ document, onReview, onViewDetails }: DocumentReviewCardProps) {
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
    <div className="admin-review-card card flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="admin-document-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-navy truncate">{document.document_name}</h3>
            <p className="text-xs text-muted truncate">
              {document.business_name} · {document.document_type}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ring-1 shrink-0 ${getStatusBadge(
            document.verification_status
          )}`}
        >
          {document.verification_status}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted mb-4">
        <span>Uploaded: {formatDate(document.upload_date)}</span>
        <span>{formatFileSize(document.file_size)}</span>
      </div>

      <div className="flex gap-2 mt-auto">
        <button onClick={() => onViewDetails?.(document.id)} className="btn-secondary flex-1 py-2! text-xs!">
          View Document
        </button>
          {document.file_url && (
            <a
              href={document.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline py-2! px-3!" aria-label="Download document"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
      </div>

      {document.verification_status === "Pending" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onReview?.(document.id, "Verified")}
            className="btn-primary flex-1 py-2! text-xs! bg-emerald-600! hover:bg-emerald-700!"
          >
            <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
            Approve
          </button>
          <button
            onClick={() => onReview?.(document.id, "Needs Review")}
            className="btn-outline flex-1 py-2! text-xs! border-orange-500! text-orange-600! hover:bg-orange-50!"
          >
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
            Review
          </button>
          <button
            onClick={() => onReview?.(document.id, "Rejected")}
            className="btn-outline flex-1 py-2! text-xs! border-red-600! text-red-600! hover:bg-red-50!"
          >
            <XCircle className="w-3.5 h-3.5 inline mr-1" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}