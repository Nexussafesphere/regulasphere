"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";

interface Assignment {
  id: string;
  business_name: string;
  obligation_title: string;
  regulator: string;
  deadline: string;
  status: string;
  priority: string;
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    business_name: "Lagos Fintech Solutions",
    obligation_title: "NDPC Annual Data Protection Audit",
    regulator: "NDPC",
    deadline: "2027-03-15",
    status: "In Progress",
    priority: "Critical",
  },
  {
    id: "a2",
    business_name: "Lagos Fintech Solutions",
    obligation_title: "NITDA AI Governance Compliance",
    regulator: "NITDA",
    deadline: "2026-07-31",
    status: "Pending",
    priority: "Critical",
  },
  {
    id: "a3",
    business_name: "Abuja Health Plus",
    obligation_title: "DPIA for Patient Data",
    regulator: "NDPC",
    deadline: "2026-09-30",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "a4",
    business_name: "Kano Manufacturing Co",
    obligation_title: "NAFDAC Product Registration",
    regulator: "NAFDAC",
    deadline: "2026-10-15",
    status: "Pending",
    priority: "High",
  },
  {
    id: "a5",
    business_name: "Port Harcourt Traders Ltd",
    obligation_title: "SEC VASP Registration",
    regulator: "SEC",
    deadline: "2026-08-31",
    status: "Overdue",
    priority: "Critical",
  },
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.obligation_title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
      case "Overdue":
        return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-muted shrink-0" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-purple-500 shrink-0" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "badge badge-gold";
      case "High":
        return "badge badge-outline";
      default:
        return "badge badge-silver";
    }
  };

  const markComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a))
    );
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
              My Assignments
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
              placeholder="Search assignments..."
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
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="space-y-3 w-full">
          {filtered.map((assignment) => (
            <div key={assignment.id} className="card w-full">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gold shrink-0" />
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {assignment.obligation_title}
                    </h3>
                    <span className={`${getPriorityBadge(assignment.priority)} shrink-0`}>
                      {assignment.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {assignment.business_name} | {assignment.regulator} | Due:{" "}
                    {assignment.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusIcon(assignment.status)}
                  <span className="text-xs font-medium text-navy truncate">
                    {assignment.status}
                  </span>
                  {assignment.status !== "Completed" && (
                    <button
                      onClick={() => markComplete(assignment.id)}
                      className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 shrink-0" /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 w-full">
              <FileText className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No assignments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}