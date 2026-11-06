"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Building2, MapPin, Users, DollarSign, Shield, Database, Bot, BadgeCheck, XCircle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface BusinessDetail {
  id: string;
  business_name: string;
  rc_number: string | null;
  tin: string | null;
  sector: string;
  state: string | null;
  address: string | null;
  employee_count: number;
  annual_revenue: string | null;
  data_processing: boolean;
  data_subjects_count: number;
  has_sensitive_data: boolean;
  has_cross_border_transfer: boolean;
  has_data_protection_officer: boolean;
  dpco_engaged: boolean;
  dpco_name: string | null;
  has_foreign_operations: boolean;
  is_fintech: boolean;
  uses_ai: boolean;
  ai_systems_description: string | null;
  compliance_score: number;
  verification_status: string;
  created_at: string;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const { data } = await adminApi.getBusinesses({ search: "", page: 1, limit: 100 });
        const foundBusiness = (data || []).find((b: BusinessDetail) => b.id === businessId);
        setBusiness(foundBusiness || null);
      } catch (error) {
        console.error("Failed to fetch business:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadBusiness();
  }, [businessId]);

  const handleVerify = async (approved: boolean) => {
    if (!business) return;
    try {
      await adminApi.verifyBusiness(business.id, approved);
      setBusiness({ ...business, verification_status: approved ? "verified" : "rejected" });
    } catch (error) {
      console.error("Failed to verify business:", error);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-lg mx-auto" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="card text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
          <Building2 className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">Business Not Found</h3>
        <p className="text-muted text-sm">The requested business does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-navy truncate">{business.business_name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>{business.sector}</span>
              {business.rc_number && <span>· RC: {business.rc_number}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {business.verification_status !== "verified" && (
            <button onClick={() => handleVerify(true)} className="btn-primary bg-emerald-600! hover:bg-emerald-700!">
              <BadgeCheck className="w-4 h-4 inline mr-2" />
              Verify
            </button>
          )}
          {business.verification_status !== "rejected" && (
            <button onClick={() => handleVerify(false)} className="btn-outline border-red-600! text-red-600! hover:bg-red-50!">
              <XCircle className="w-4 h-4 inline mr-2" />
              Reject
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Business Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span className="text-muted">
                {business.address || "N/A"}, {business.state || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-gold shrink-0" />
              <span className="text-muted">{business.employee_count} employees</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gold shrink-0" />
              <span className="text-muted">Revenue: {business.annual_revenue || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-gold shrink-0" />
              <span className="text-muted">Compliance Score: {business.compliance_score}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Data Processing</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-gold shrink-0" />
              <span className="text-navy">Data Processing: {business.data_processing ? "Yes" : "No"}</span>
            </div>
            {business.data_processing && (
              <div className="pl-6 space-y-1.5">
                <p className="text-sm text-muted">Data Subjects: {business.data_subjects_count}</p>
                <p className="text-sm text-muted">Sensitive Data: {business.has_sensitive_data ? "Yes" : "No"}</p>
                <p className="text-sm text-muted">
                  Cross-Border Transfer: {business.has_cross_border_transfer ? "Yes" : "No"}
                </p>
                <p className="text-sm text-muted">DPO: {business.has_data_protection_officer ? "Yes" : "No"}</p>
                {business.dpco_engaged && <p className="text-sm text-muted">DPCO: {business.dpco_name || "Engaged"}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">AI & Fintech</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Bot className="w-4 h-4 text-gold shrink-0" />
              <span className="text-navy">Uses AI: {business.uses_ai ? "Yes" : "No"}</span>
            </div>
            {business.uses_ai && business.ai_systems_description && (
              <p className="text-sm text-muted pl-6">AI Systems: {business.ai_systems_description}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-gold shrink-0" />
              <span className="text-navy">Fintech: {business.is_fintech ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-gold shrink-0" />
              <span className="text-navy">Foreign Operations: {business.has_foreign_operations ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}