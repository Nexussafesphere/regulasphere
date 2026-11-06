"use client";

import { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import DocumentReviewCard from "@/components/admin/DocumentReviewCard";
import { adminApi } from "@/lib/admin-api";
import { AdminFilters, DocumentReviewData } from "@/types/admin";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const filters: AdminFilters = { search: searchTerm, page: 1, limit: 50 };
        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }
        const { data } = await adminApi.getDocuments(filters);
        setDocuments(data || []);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadDocuments();
  }, [searchTerm, filterStatus]);

  const handleReview = async (documentId: string, status: string) => {
    try {
      await adminApi.reviewDocument(documentId, status);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? { ...doc, verification_status: status } : doc))
      );
    } catch (error) {
      console.error("Failed to review document:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <FileText className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-navy">Document Verification</h2>
          <p className="text-sm text-muted mt-0.5">Review and verify business documents</p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search documents..."
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
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
          <option value="Needs Review">Needs Review</option>
        </select>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="spinner-lg mx-auto" />
        </div>
      ) : documents.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-(--army-green-pale)">
            <FileText className="h-6 w-6 text-muted" />
          </div>
          <p className="text-sm font-medium text-navy">No documents found</p>
          <p className="mt-1 text-xs text-muted">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentReviewCard key={document.id} document={document} onReview={handleReview} />
          ))}
        </div>
      )}
    </div>
  );
}