"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserCheck, Star, Award, Briefcase, Mail, Phone, Calendar, Shield, BadgeCheck, XCircle } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface ConsultantDetail {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  specialization: string[];
  years_experience: number;
  certifications: string[];
  dpco_license_number: string | null;
  rating: number;
  total_reviews: number;
  bio: string | null;
  profile_image_url: string | null;
  availability: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export default function ConsultantDetailPage() {
  const params = useParams();
  const consultantId = params.id as string;
  const [consultant, setConsultant] = useState<ConsultantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsultant = async () => {
      try {
        const { data } = await adminApi.getConsultants({ search: "", page: 1, limit: 100 });
        const foundConsultant = (data || []).find((c: ConsultantDetail) => c.id === consultantId);
        setConsultant(foundConsultant || null);
      } catch (error) {
        console.error("Failed to fetch consultant:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadConsultant();
  }, [consultantId]);

  const handleVerify = async (approved: boolean) => {
    if (!consultant) return;
    try {
      await adminApi.verifyConsultant(consultant.id, approved);
      setConsultant({ ...consultant, is_verified: approved });
    } catch (error) {
      console.error("Failed to verify consultant:", error);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner-lg mx-auto" />
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="card text-center py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
          <UserCheck className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">Consultant Not Found</h3>
        <p className="text-muted text-sm">The requested consultant does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="gold-gradient text-navy flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-sm">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-navy truncate">{consultant.full_name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Star className="w-4 h-4 text-gold" />
              <span>
                {consultant.rating.toFixed(1)} ({consultant.total_reviews} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!consultant.is_verified ? (
            <>
              <button onClick={() => handleVerify(true)} className="btn-primary bg-emerald-600! hover:bg-emerald-700!">
                <BadgeCheck className="w-4 h-4 inline mr-2" />
                Approve
              </button>
              <button onClick={() => handleVerify(false)} className="btn-outline border-red-600! text-red-600! hover:bg-red-50!">
                <XCircle className="w-4 h-4 inline mr-2" />
                Reject
              </button>
            </>
          ) : (
            <button onClick={() => handleVerify(false)} className="btn-outline border-red-600! text-red-600! hover:bg-red-50!">
              <XCircle className="w-4 h-4 inline mr-2" />
              Revoke Verification
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Professional Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Experience</p>
                <p className="text-sm text-muted">{consultant.years_experience} years</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-navy mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {consultant.specialization.map((spec) => (
                  <span key={spec} className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-navy mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {consultant.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 ring-1 ring-purple-100 px-2 py-1 rounded-full"
                  >
                    <Award className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            {consultant.dpco_license_number && (
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy">DPCO License</p>
                  <p className="text-sm text-muted">{consultant.dpco_license_number}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Email</p>
                <p className="text-sm text-muted">{consultant.email}</p>
              </div>
            </div>
            {consultant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy">Phone</p>
                  <p className="text-sm text-muted">{consultant.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Joined</p>
                <p className="text-sm text-muted">{new Date(consultant.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy mb-1">Status</p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                    consultant.is_verified
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                      : "bg-amber-50 text-amber-700 ring-amber-100"
                  }`}
                >
                  {consultant.is_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {consultant.bio && (
        <div className="card">
          <h3 className="text-base font-semibold text-navy mb-4">Bio</h3>
          <p className="text-sm text-muted leading-relaxed">{consultant.bio}</p>
        </div>
      )}
    </div>
  );
}