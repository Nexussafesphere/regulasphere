"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

interface DocumentUploadProps {
  businessId: string;
  documentTypes: string[];
  onSuccess: () => void;
  onClose: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB, matches server-side limit

export default function DocumentUpload({
  businessId,
  documentTypes,
  onSuccess,
  onClose,
}: DocumentUploadProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState(documentTypes[0] || "Other");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      setError("File exceeds 10MB limit");
      return;
    }
    setError(null);
    setFile(selected);
    if (!name) setName(selected.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!name.trim() || !file || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("businessId", businessId);
      formData.append("documentName", name);
      formData.append("documentType", type);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            <h3 className="text-base font-semibold text-navy">Upload Document</h3>
          </div>
          <button onClick={onClose} className="text-muted hover:text-navy" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="input"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            {file && (
              <p className="text-[10px] text-muted mt-1">
                {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div>
            <label className="label">Document Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., CAC Certificate of Incorporation"
            />
          </div>

          <div>
            <label className="label">Document Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="select">
              {documentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !name.trim() || !file}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}