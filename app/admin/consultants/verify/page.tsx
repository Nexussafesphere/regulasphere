"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Search } from "lucide-react";
import ConsultantVerificationCard from "@/components/admin/ConsultantVerificationCard";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters } from "@/types/admin";

interface VerificationConsultant {
  id: string;
  full_name: string;
  specialization: string[];
  years_experience: number;
  certifications: string[];
  dpco_license_number?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  created_at: string;
}

export default function ConsultantVerificationPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<VerificationConsultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const filters: AdminFilters = { search: searchTerm, page: 1, limit: 100 };
        const { data } = await adminApi.getConsultants(filters);
        const allConsultants = data || [];

        const filtered = allConsultants.filter((consultant: VerificationConsultant) => {
          if (filterStatus === "pending") return !consultant.is_verified;
          if (filterStatus === "verified") return consultant.is_verified;
          return true;
        });

        setConsultants(filtered);
      } catch (error) {
        console.error("Failed to fetch consultants:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadConsultants();
  }, [searchTerm, filterStatus]);

  const handleVerify = async (consultantId: string, approved: boolean) => {
    try {
      await adminApi.verifyConsultant(consultantId, approved);
      setConsultants((prev) =>
        prev.map((consultant) => (consultant.id === consultantId ? { ...consultant, is_verified: approved } : consultant))
      );
    } catch (error) {
      console.error("Failed to verify consultant:", error);
    }
  };

  const handleViewDetails = (consultantId: string) => {
    router.push(`/admin/consultants/${consultantId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-navy">Consultant Verification</h2>
            <p className="text-sm text-muted mt-0.5">Review and verify consultant credentials</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search consultants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="pending">Pending Verification</option>
          <option value="verified">Verified</option>
          <option value="all">All Consultants</option>
        </select>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : consultants.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <Shield className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No Consultants to Verify</h3>
          <p className="text-muted text-sm">All consultant verification requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultants.map((consultant) => (
            <ConsultantVerificationCard
              key={consultant.id}
              consultant={consultant}
              onVerify={handleVerify}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}