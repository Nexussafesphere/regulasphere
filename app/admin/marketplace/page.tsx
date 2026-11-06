"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Search, Star, Store, UserCheck, X } from "lucide-react";

interface MarketplaceListing {
  id: string;
  full_name: string;
  specialization: string[];
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  availability: boolean;
  created_at: string;
}

export default function AdminMarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/consultants?limit=100");
      const result = (await response.json()) as {
        data?: MarketplaceListing[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Failed to load listings");
      setListings(result.data ?? []);
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      void loadListings();
    }
  }, [loadListings]);

  const moderateListing = async (listingId: string, action: "approve" | "reject") => {
    setModeratingId(listingId);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/marketplace/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, action }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Failed to update listing");
      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? { ...listing, is_verified: action === "approve" }
            : listing
        )
      );
    } catch (error: unknown) {
      setLoadError(error instanceof Error ? error.message : "Failed to update listing");
    } finally {
      setModeratingId(null);
    }
  };

  const filteredListings = listings.filter((listing) =>
    listing.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <Store className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Marketplace Moderation</h2>
          <p className="text-sm text-muted mt-0.5">Monitor and moderate consultant marketplace listings</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
        />
      </div>

      {loadError && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{loadError}</span>
          <button type="button" onClick={loadListings} className="underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--army-green-pale)">
            <Store className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-1">No Marketplace Listings</h3>
          <p className="text-muted text-sm">Consultant listings will appear here once they are created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="gold-gradient text-navy flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-sm">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-navy truncate">{listing.full_name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Star className="w-3.5 h-3.5 text-gold" />
                    <span>
                      {listing.rating.toFixed(1)} ({listing.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="text-xs bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${
                    listing.is_verified
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                      : "bg-amber-50 text-amber-700 ring-amber-100"
                  }`}
                >
                  {listing.is_verified ? "Verified" : "Pending"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    listing.availability ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${listing.availability ? "bg-emerald-500" : "bg-red-500"}`} />
                  {listing.availability ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="mt-4 flex gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => moderateListing(listing.id, "approve")}
                  disabled={moderatingId !== null || listing.is_verified}
                  className="btn btn-secondary btn-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => moderateListing(listing.id, "reject")}
                  disabled={moderatingId !== null || !listing.is_verified}
                  className="btn btn-secondary btn-sm flex items-center gap-2 text-red-700 disabled:opacity-50"
                >
                  <X className="h-4 w-4" /> Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}