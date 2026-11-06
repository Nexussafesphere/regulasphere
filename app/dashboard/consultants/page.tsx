"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Star,
  Users,
  CheckCircle2,
  MessageSquare,
  UserPlus,
} from "lucide-react";

interface Consultant {
  id: string;
  full_name: string;
  specialization: string[];
  years_experience: number;
  certifications: string[];
  dpco_license_number?: string;
  rating: number;
  total_reviews: number;
  bio?: string;
  availability: boolean;
}

const CONSULTANTS: Consultant[] = [
  {
    id: "c1",
    full_name: "Dr. Amina Ibrahim",
    specialization: ["Data Protection", "AI Governance"],
    years_experience: 12,
    certifications: ["CDPO", "CIPP/E"],
    dpco_license_number: "DPCO-2024-001",
    rating: 4.8,
    total_reviews: 42,
    bio: "Former NDPC auditor with expertise in AI governance frameworks.",
    availability: true,
  },
  {
    id: "c2",
    full_name: "Barrister Emeka Okafor",
    specialization: ["CAC", "Tax", "Licensing"],
    years_experience: 15,
    certifications: ["SAN", "CITN"],
    rating: 4.9,
    total_reviews: 67,
    bio: "Corporate lawyer specializing in CAC compliance and tax law.",
    availability: true,
  },
  {
    id: "c3",
    full_name: "Mrs. Funke Adeyemi",
    specialization: ["Pension", "Employment"],
    years_experience: 8,
    certifications: ["CIPM", "PENCOM Certified"],
    rating: 4.6,
    total_reviews: 28,
    bio: "HR compliance expert with PENCOM specialization.",
    availability: true,
  },
  {
    id: "c4",
    full_name: "Dr. Chioma Eze",
    specialization: ["AI Governance", "Data Protection"],
    years_experience: 7,
    certifications: ["PhD AI Ethics", "CDPO"],
    rating: 4.9,
    total_reviews: 18,
    bio: "Leading AI governance consultant in West Africa.",
    availability: true,
  },
];

const SPECIALIZATIONS = [
  "All",
  "Data Protection",
  "Tax",
  "CAC",
  "AI Governance",
  "Pension",
  "Employment",
  "Licensing",
];

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");

  const filtered = CONSULTANTS.filter((consultant) => {
    const matchesSearch = consultant.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      specializationFilter === "All" ||
      consultant.specialization.includes(specializationFilter);
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 px-4 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              My Consultants
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
              placeholder="Search consultants..."
              className="input pl-10 w-full text-sm"
            />
          </div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="select w-full sm:w-44 shrink-0 text-sm"
          >
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
          {filtered.map((consultant) => (
            <div key={consultant.id} className="card w-full">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-navy truncate">
                    {consultant.full_name}
                  </h3>
                  <p className="text-xs text-muted">
                    {consultant.years_experience} years experience
                  </p>
                </div>
                {consultant.availability && (
                  <span className="badge badge-gold shrink-0">Available</span>
                )}
              </div>

              <div className="flex gap-1 mb-2 flex-wrap">
                {consultant.specialization.map((spec) => (
                  <span key={spec} className="badge badge-outline text-[10px]">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-muted mb-2">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold shrink-0" />
                  {consultant.rating}
                </span>
                <span>{consultant.total_reviews} reviews</span>
                {consultant.dpco_license_number && (
                  <span className="truncate">{consultant.dpco_license_number}</span>
                )}
              </div>

              {consultant.bio && (
                <p className="text-xs text-secondary leading-relaxed mb-3">
                  {consultant.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-2 w-full">
                <button className="btn btn-primary btn-sm flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> Assign
                </button>
                <button className="btn btn-secondary btn-sm flex items-center gap-1 text-xs">
                  <MessageSquare className="w-3 h-3 shrink-0" /> Message
                </button>
                <button className="btn btn-secondary btn-sm flex items-center gap-1 text-xs">
                  <UserPlus className="w-3 h-3 shrink-0" /> View Profile
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-12 w-full">
              <Users className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted">No consultants found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}