"use client";

import { FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface QueueItem {
  id: string;
  document_name: string;
  business_name: string;
  upload_date: string;
  status: string;
}

interface VerificationQueueProps {
  items: QueueItem[];
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  onRequestChanges: (id: string) => void;
}

export default function VerificationQueue({
  items,
  onVerify,
  onReject,
  onRequestChanges,
}: VerificationQueueProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="card">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gold" />
                <h3 className="text-sm font-semibold text-navy">
                  {item.document_name}
                </h3>
              </div>
              <p className="text-xs text-muted">
                {item.business_name} | Uploaded: {item.upload_date}
              </p>
            </div>
            <span
              className={`badge ${
                item.status === "Pending" ? "badge-outline" : "badge-gold"
              }`}
            >
              {item.status}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onVerify(item.id)}
                className="btn btn-primary btn-sm flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Verify
              </button>
              <button
                onClick={() => onReject(item.id)}
                className="btn btn-secondary btn-sm flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Reject
              </button>
              <button
                onClick={() => onRequestChanges(item.id)}
                className="btn btn-secondary btn-sm flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" /> Request Changes
              </button>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">No documents in queue.</p>
        </div>
      )}
    </div>
  );
}