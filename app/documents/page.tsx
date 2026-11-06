"use client";

import { useState } from "react";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "Verified" | "Pending" | "Rejected" | "Needs Review";
  verifiedBy?: string;
  size: string;
  relatedObligation?: string;
}

const documents: Document[] = [
  {
    id: "1",
    name: "CAC Certificate of Incorporation",
    type: "CAC Certificate",
    uploadDate: "2026-08-01",
    status: "Verified",
    verifiedBy: "Barrister Emeka Okafor",
    size: "2.4 MB",
    relatedObligation: "CAC Business Registration",
  },
  {
    id: "2",
    name: "Tax Clearance Certificate 2025",
    type: "Tax Clearance",
    uploadDate: "2026-08-03",
    status: "Verified",
    verifiedBy: "Barrister Emeka Okafor",
    size: "1.8 MB",
    relatedObligation: "NRS CIT Filing",
  },
  {
    id: "3",
    name: "Data Protection Audit Report 2025",
    type: "NDPC Audit Report",
    uploadDate: "2026-08-05",
    status: "Pending",
    size: "3.2 MB",
    relatedObligation: "NDPC Annual Data Protection Audit",
  },
  {
    id: "4",
    name: "AI Governance Policy Document",
    type: "AI Governance Policy",
    uploadDate: "2026-08-07",
    status: "Needs Review",
    verifiedBy: "Dr. Chioma Eze",
    size: "1.1 MB",
    relatedObligation: "NITDA AI Governance Compliance",
  },
  {
    id: "5",
    name: "PENCOM Compliance Certificate",
    type: "Pension Compliance",
    uploadDate: "2026-08-08",
    status: "Verified",
    verifiedBy: "Mrs. Funke Adeyemi",
    size: "0.9 MB",
    relatedObligation: "PENCOM Pension Remittance",
  },
  {
    id: "6",
    name: "SEC VASP Application",
    type: "Other",
    uploadDate: "2026-08-10",
    status: "Rejected",
    verifiedBy: "SEC",
    size: "4.5 MB",
    relatedObligation: "SEC VASP Registration",
  },
  {
    id: "7",
    name: "NSITF Registration Certificate",
    type: "Other",
    uploadDate: "2026-08-12",
    status: "Verified",
    size: "1.5 MB",
    relatedObligation: "NSITF Employee Compensation",
  },
  {
    id: "8",
    name: "DPIA Report - AI Credit Scoring",
    type: "DPIA Report",
    uploadDate: "2026-08-14",
    status: "Pending",
    size: "2.8 MB",
    relatedObligation: "NDPC DPIA for AI Systems",
  },
];

const documentTypes = [
  "All",
  "CAC Certificate",
  "Tax Clearance",
  "NDPC Audit Report",
  "AI Governance Policy",
  "Pension Compliance",
  "DPIA Report",
  "Other",
];

const statusFilters = [
  "All",
  "Verified",
  "Pending",
  "Rejected",
  "Needs Review",
];

const statusColors: Record<Document["status"], string> = {
  Verified: "badge badge-gold",
  Pending: "badge badge-outline",
  Rejected: "badge badge-silver",
  "Needs Review": "badge badge-outline",
};

export default function DocumentsPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = typeFilter === "All" || doc.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || doc.status === statusFilter;
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <>
      <section className="bg-navy text-white py-14">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Documents</h1>
              <p className="text-silver text-sm">
                Upload, manage, and verify your compliance documents.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary btn-sm"
            >
              Upload Document
            </button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              className="input flex-1"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="select md:w-48"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
            <select
              className="select md:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm mb-1">{doc.name}</h3>
                    <p className="text-xs text-muted">{doc.type}</p>
                  </div>
                  <span className={statusColors[doc.status]}>{doc.status}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <span>Uploaded: {doc.uploadDate}</span>
                  <span>|</span>
                  <span>{doc.size}</span>
                </div>
                {doc.verifiedBy && (
                  <p className="text-xs text-secondary mb-3">
                    Verified by: {doc.verifiedBy}
                  </p>
                )}
                {doc.relatedObligation && (
                  <p className="text-xs text-secondary mb-3">
                    Related: {doc.relatedObligation}
                  </p>
                )}
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm">View</button>
                  <button className="btn btn-secondary btn-sm">Download</button>
                  <button className="btn btn-secondary btn-sm">Replace</button>
                </div>
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted">
                No documents found matching your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-muted hover:text-navy"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Document Name</label>
                <input type="text" className="input" placeholder="Document name" />
              </div>
              <div>
                <label className="label">Document Type</label>
                <select className="select">
                  {documentTypes.filter((t) => t !== "All").map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Related Obligation</label>
                <select className="select">
                  <option value="">None</option>
                  <option value="CAC Annual Returns">CAC Annual Returns</option>
                  <option value="NDPC Audit">NDPC Audit</option>
                  <option value="NITDA AI Governance">NITDA AI Governance</option>
                  <option value="NRS VAT">NRS VAT</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-sm text-muted mb-2">
                  Drag and drop file here
                </p>
                <p className="text-xs text-muted">or</p>
                <button className="btn btn-secondary btn-sm mt-2">
                  Browse Files
                </button>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn btn-primary w-full"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}