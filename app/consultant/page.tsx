"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  RefreshCw,
  Bell,
} from "lucide-react";

interface Client {
  id: string;
  business_name: string;
  sector: string;
  compliance_score: number;
  assigned_obligations: number;
  pending_documents: number;
}

interface VerificationTask {
  id: string;
  document_name: string;
  business_name: string;
  upload_date: string;
  status: string;
}

interface Assignment {
  id: string;
  business_name: string;
  obligation_title: string;
  deadline: string;
  status: string;
}

const CLIENTS: Client[] = [
  {
    id: "b1",
    business_name: "Lagos Fintech Solutions",
    sector: "Fintech",
    compliance_score: 68,
    assigned_obligations: 5,
    pending_documents: 2,
  },
  {
    id: "b2",
    business_name: "Abuja Health Plus",
    sector: "Healthcare",
    compliance_score: 55,
    assigned_obligations: 3,
    pending_documents: 1,
  },
  {
    id: "b3",
    business_name: "Kano Manufacturing Co",
    sector: "Manufacturing",
    compliance_score: 72,
    assigned_obligations: 4,
    pending_documents: 0,
  },
  {
    id: "b4",
    business_name: "Port Harcourt Traders Ltd",
    sector: "Trading",
    compliance_score: 45,
    assigned_obligations: 2,
    pending_documents: 3,
  },
];

const VERIFICATIONS: VerificationTask[] = [
  {
    id: "d1",
    document_name: "Data Protection Audit Report 2025",
    business_name: "Lagos Fintech Solutions",
    upload_date: "2026-08-05",
    status: "Pending",
  },
  {
    id: "d2",
    document_name: "AI Governance Policy Document",
    business_name: "Lagos Fintech Solutions",
    upload_date: "2026-08-07",
    status: "Needs Review",
  },
  {
    id: "d3",
    document_name: "DPIA Report - Patient Records",
    business_name: "Abuja Health Plus",
    upload_date: "2026-08-10",
    status: "Pending",
  },
  {
    id: "d4",
    document_name: "SEC VASP Application",
    business_name: "Port Harcourt Traders Ltd",
    upload_date: "2026-08-12",
    status: "Pending",
  },
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    business_name: "Lagos Fintech Solutions",
    obligation_title: "NDPC Annual Data Protection Audit",
    deadline: "2027-03-15",
    status: "In Progress",
  },
  {
    id: "a2",
    business_name: "Lagos Fintech Solutions",
    obligation_title: "NITDA AI Governance Compliance",
    deadline: "2026-07-31",
    status: "Pending",
  },
  {
    id: "a3",
    business_name: "Abuja Health Plus",
    obligation_title: "DPIA for Patient Data",
    deadline: "2026-09-30",
    status: "In Progress",
  },
  {
    id: "a4",
    business_name: "Kano Manufacturing Co",
    obligation_title: "NAFDAC Product Registration",
    deadline: "2026-10-15",
    status: "Pending",
  },
];

export default function ConsultantPage() {
  const [activeTab, setActiveTab] = useState<"clients" | "verifications" | "assignments">("clients");
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadData();
    }
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading consultant dashboard...</p>
        </div>
      </div>
    );
  }

  const totalClients = CLIENTS.length;
  const pendingVerifications = VERIFICATIONS.length;
  const totalAssignments = ASSIGNMENTS.length;
  const averageRating = 4.8;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-8 px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 w-full">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-navy truncate">
              Consultant Dashboard
            </h1>
            <p className="text-xs md:text-sm text-muted truncate">
              Welcome back, Dr. Amina Ibrahim
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Bell className="w-5 h-5 text-gold shrink-0" />
            <span className="badge badge-gold">{pendingVerifications}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6 w-full">
          <div className="card text-center py-4 md:py-6 w-full">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-navy mb-0.5 md:mb-1">{totalClients}</p>
            <p className="text-[10px] md:text-xs text-muted">Active Clients</p>
          </div>
          <div className="card text-center py-4 md:py-6 w-full">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-amber-500 mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-amber-500 mb-0.5 md:mb-1">{pendingVerifications}</p>
            <p className="text-[10px] md:text-xs text-muted">Documents to Verify</p>
          </div>
          <div className="card text-center py-4 md:py-6 w-full">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-blue-500 mb-0.5 md:mb-1">{totalAssignments}</p>
            <p className="text-[10px] md:text-xs text-muted">Active Assignments</p>
          </div>
          <div className="card text-center py-4 md:py-6 w-full col-span-2 lg:col-span-1">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto mb-1 md:mb-2 shrink-0" />
            <p className="text-lg md:text-2xl font-bold text-gold mb-0.5 md:mb-1">{averageRating}</p>
            <p className="text-[10px] md:text-xs text-muted">Average Rating</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto w-full">
          <button
            onClick={() => setActiveTab("clients")}
            className={`btn btn-sm whitespace-nowrap shrink-0 ${activeTab === "clients" ? "btn-primary" : "btn-secondary"}`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab("verifications")}
            className={`btn btn-sm whitespace-nowrap shrink-0 ${activeTab === "verifications" ? "btn-primary" : "btn-secondary"}`}
          >
            Document Verification
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`btn btn-sm whitespace-nowrap shrink-0 ${activeTab === "assignments" ? "btn-primary" : "btn-secondary"}`}
          >
            My Assignments
          </button>
        </div>

        {activeTab === "clients" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
            {CLIENTS.map((client) => (
              <div key={client.id} className="card w-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {client.business_name}
                    </h3>
                    <p className="text-xs text-muted">{client.sector}</p>
                  </div>
                  <span className={`text-lg md:text-xl font-bold ${getScoreColor(client.compliance_score)} shrink-0`}>
                    {client.compliance_score}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs text-muted mb-3 md:mb-4">
                  <span>{client.assigned_obligations} obligations</span>
                  <span>{client.pending_documents} documents pending</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/consultant/clients/${client.id}`}
                    className="btn btn-primary btn-sm flex items-center gap-1 text-xs"
                  >
                    View Details <ChevronRight className="w-3 h-3 shrink-0" />
                  </Link>
                  <button className="btn btn-secondary btn-sm text-xs">Message</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "verifications" && (
          <div className="space-y-3 w-full">
            {VERIFICATIONS.map((task) => (
              <div key={task.id} className="card w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {task.document_name}
                    </h3>
                    <p className="text-xs text-muted truncate">
                      {task.business_name} | Uploaded: {task.upload_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge shrink-0 ${task.status === "Pending" ? "badge-outline" : "badge-gold"}`}>
                      {task.status}
                    </span>
                    <div className="flex gap-1.5 md:gap-2">
                      <button className="btn btn-primary btn-sm flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3 h-3 shrink-0" /> Verify
                      </button>
                      <button className="btn btn-secondary btn-sm text-xs">Reject</button>
                      <button className="btn btn-secondary btn-sm text-xs hidden sm:block">Request Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-3 w-full">
            {ASSIGNMENTS.map((assignment) => (
              <div key={assignment.id} className="card w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-navy truncate">
                      {assignment.obligation_title}
                    </h3>
                    <p className="text-xs text-muted truncate">
                      {assignment.business_name} | Due: {assignment.deadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge badge-outline shrink-0">{assignment.status}</span>
                    <div className="flex gap-1.5 md:gap-2">
                      <button className="btn btn-primary btn-sm flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3 h-3 shrink-0" /> Mark Complete
                      </button>
                      <button className="btn btn-secondary btn-sm text-xs">Add Note</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}