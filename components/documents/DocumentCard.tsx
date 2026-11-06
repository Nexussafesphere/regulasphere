"use client";

import { FileText, Eye, Download } from "lucide-react";

interface DocumentCardProps {
  id: string;
  name: string;
  type?: string;
  status: string;
  uploadDate?: string;
  notes?: string;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function DocumentCard({
  id,
  name,
  type,
  status,
  uploadDate,
  notes,
  onView,
  onDownload,
}: DocumentCardProps) {
  const getStatusBadge = (docStatus: string) => {
    switch (docStatus) {
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

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-navy">{name}</h3>
            <p className="text-xs text-muted">{type || "Other"}</p>
          </div>
        </div>
        <span className={getStatusBadge(status)}>{status}</span>
      </div>

      <p className="text-xs text-muted mb-3">
        Uploaded: {uploadDate || "Unknown"}
      </p>

      {notes && <p className="text-xs text-secondary mb-3">{notes}</p>}

      <div className="flex gap-2">
        <button
          onClick={() => onView?.(id)}
          className="btn btn-secondary btn-sm flex items-center gap-1"
        >
          <Eye className="w-3 h-3" /> View
        </button>
        <button
          onClick={() => onDownload?.(id)}
          className="btn btn-secondary btn-sm flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> Download
        </button>
      </div>
    </div>
  );
}