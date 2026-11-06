"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";

interface VerificationTask {
  id: string;
  document_name: string;
  business_name: string;
  document_type: string;
  upload_date: string;
  status: string;
  notes?: string;
}

const TASKS: VerificationTask[] = [
  {
    id: "v1",
    document_name: "Data Protection Audit Report 2025",
    business_name: "Lagos Fintech Solutions",
    document_type: "NDPC Audit Report",
    upload_date: "2026-08-05",
    status: "Pending",
  },
  {
    id: "v2",
    document_name: "AI Governance Policy Document",
    business_name: "Lagos Fintech Solutions",
    document_type: "AI Governance Policy",
    upload_date: "2026-08-07",
    status: "Needs Review",
  },
  {
    id: "v3",
    document_name: "DPIA Report - Patient Records",
    business_name: "Abuja Health Plus",
    document_type: "DPIA Report",
    upload_date: "2026-08-10",
    status: "Pending",
  },
  {
    id: "v4",
    document_name: "SEC VASP Application",
    business_name: "Port Harcourt Traders Ltd",
    document_type: "Other",
    upload_date: "2026-08-12",
    status: "Pending",
  },
  {
    id: "v5",
    document_name: "Pension Compliance Certificate",
    business_name: "Kano Manufacturing Co",
    document_type: "Pension Compliance",
    upload_date: "2026-08-14",
    status: "Pending",
  },
];

export default function VerifyPage() {
  const [tasks, setTasks] = useState<VerificationTask[]>(TASKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");

  const filtered = tasks.filter((task) => {
    const matchesSearch = task.document_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "Verified", notes: verificationNotes } : t
      )
    );
    setSelectedTask(null);
    setVerificationNotes("");
  };

  const handleReject = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "Rejected", notes: verificationNotes } : t
      )
    );
    setSelectedTask(null);
    setVerificationNotes("");
  };

  const handleRequestChanges = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "Needs Review", notes: verificationNotes } : t
      )
    );
    setSelectedTask(null);
    setVerificationNotes("");
  };

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/consultant"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Consultant Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              Document Verification
            </h1>
          </div>
        </div>

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select w-full sm:w-40 text-sm shrink-0"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-3 w-full">
          {filtered.map((task) => (
            <div key={task.id} className="card w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gold shrink-0" />
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {task.document_name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {task.business_name} | {task.document_type} | Uploaded:{" "}
                    {task.upload_date}
                  </p>
                  {task.notes && (
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      Notes: {task.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`badge shrink-0 ${
                      task.status === "Verified"
                        ? "badge-gold"
                        : task.status === "Rejected"
                        ? "badge-silver"
                        : "badge-outline"
                    }`}
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setVerificationNotes("");
                    }}
                    className="btn btn-primary btn-sm text-xs"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 w-full">
              <Filter className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No documents found.</p>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-navy truncate">
                Review Document
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-muted hover:text-navy p-1"
                aria-label="Close modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-navy truncate">
                {selectedTask.document_name}
              </p>
              <p className="text-xs text-muted">{selectedTask.business_name}</p>
            </div>

            <div className="mb-4">
              <label className="label text-xs sm:text-sm">Verification Notes</label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="input w-full"
                rows={3}
                placeholder="Enter verification notes..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={() => handleVerify(selectedTask.id)}
                className="btn btn-primary flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Verify
              </button>
              <button
                onClick={() => handleReject(selectedTask.id)}
                className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <XCircle className="w-4 h-4 shrink-0" /> Reject
              </button>
              <button
                onClick={() => handleRequestChanges(selectedTask.id)}
                className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" /> Request Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}