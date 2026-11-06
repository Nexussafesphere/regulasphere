"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClipboardList, Building2, Calendar, Shield, AlertTriangle, DollarSign } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface ObligationDetail {
  id: string;
  title: string;
  regulator: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
  business_name: string;
  penalty: string | null;
  description: string | null;
  legal_basis: string | null;
  remediation_steps: string[] | null;
}

export default function ObligationDetailPage() {
  const params = useParams();
  const obligationId = params.id as string;
  const [obligation, setObligation] = useState<ObligationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadObligation = async () => {
      try {
        const { data } = await adminApi.getObligations({ search: "", page: 1, limit: 100 });
        const foundObligation = (data || []).find((o: ObligationDetail) => o.id === obligationId);
        setObligation(foundObligation || null);
      } catch (error) {
        console.error("Failed to fetch obligation:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadObligation();
  }, [obligationId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
      case "In Progress":
        return "bg-blue-50 text-blue-700 ring-blue-100";
      case "Overdue":
        return "bg-red-50 text-red-700 ring-red-100";
      case "Under Review":
        return "bg-purple-50 text-purple-700 ring-purple-100";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-50 text-red-700 ring-red-100";
      case "High":
        return "bg-orange-50 text-orange-700 ring-orange-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 ring-amber-100";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-lg mx-auto" />
      </div>
    );
  }

  if (!obligation) {
    return (
      <div className="card text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
          <ClipboardList className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">Obligation Not Found</h3>
        <p className="text-muted text-sm">The requested obligation does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-lg shadow-sm">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-navy truncate">{obligation.title}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getStatusColor(obligation.status)}`}>
              {obligation.status}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getPriorityColor(obligation.priority)}`}>
              {obligation.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Obligation Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Business</p>
                <p className="text-sm text-muted">{obligation.business_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Regulator</p>
                <p className="text-sm text-muted">{obligation.regulator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Deadline</p>
                <p className="text-sm text-muted">
                  {obligation.deadline ? new Date(obligation.deadline).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Category</p>
                <p className="text-sm text-muted">{obligation.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Penalty & Legal Basis</h3>
          <div className="space-y-4">
            {obligation.penalty && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy">Penalty</p>
                  <p className="text-sm text-red-600">{obligation.penalty}</p>
                </div>
              </div>
            )}
            {obligation.legal_basis && (
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy">Legal Basis</p>
                  <p className="text-sm text-muted">{obligation.legal_basis}</p>
                </div>
              </div>
            )}
            {!obligation.penalty && !obligation.legal_basis && (
              <p className="text-sm text-muted">No penalty or legal basis on record.</p>
            )}
          </div>
        </div>
      </div>

      {obligation.description && (
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Description</h3>
          <p className="text-sm text-muted leading-relaxed">{obligation.description}</p>
        </div>
      )}

      {obligation.remediation_steps && obligation.remediation_steps.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Remediation Steps</h3>
          <ol className="space-y-3">
            {obligation.remediation_steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="gold-gradient text-navy flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-muted pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}