"use client";

import { UserCheck, Star, Award, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ConsultantVerificationCardProps {
  consultant: {
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
  };
  onVerify?: (consultantId: string, approved: boolean) => void;
  onViewDetails?: (consultantId: string) => void;
}

export default function ConsultantVerificationCard({
  consultant,
  onVerify,
  onViewDetails,
}: ConsultantVerificationCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-sm">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-navy truncate">{consultant.full_name}</h3>
            <p className="text-sm text-muted">{consultant.years_experience} years experience</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ring-1 shrink-0 ${
            consultant.is_verified
              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
              : "bg-amber-50 text-amber-700 ring-amber-100"
          }`}
        >
          {consultant.is_verified ? "Verified" : "Pending"}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {consultant.specialization.map((spec) => (
            <span key={spec} className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <Award className="w-4 h-4 text-gold shrink-0" />
          <span>
            {consultant.certifications.length} certifications
            {consultant.dpco_license_number && ` · DPCO License: ${consultant.dpco_license_number}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <Star className="w-4 h-4 text-gold shrink-0" />
          <span>
            {consultant.rating.toFixed(1)} rating ({consultant.total_reviews} reviews)
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted">
          <Briefcase className="w-4 h-4 text-gold shrink-0" />
          <span>Joined {formatDate(consultant.created_at)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onViewDetails?.(consultant.id)} className="btn-secondary flex-1 py-2! text-xs!">
          View Profile
        </button>
        {!consultant.is_verified ? (
          <>
            <button
              onClick={() => onVerify?.(consultant.id, true)}
              className="btn-primary flex-1 py-2! text-xs! bg-emerald-600! hover:bg-emerald-700!"
            >
              Approve
            </button>
            <button
              onClick={() => onVerify?.(consultant.id, false)}
              className="btn-outline flex-1 py-2! text-xs! border-red-600! text-red-600! hover:bg-red-50!"
            >
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => onVerify?.(consultant.id, false)}
            className="btn-outline flex-1 py-2! text-xs! border-red-600! text-red-600! hover:bg-red-50!"
          >
            Revoke Verification
          </button>
        )}
      </div>
    </div>
  );
}