"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface DocumentItem {
  id: string;
  document_name: string;
  document_type?: string;
  verification_status: string;
  upload_date?: string;
}

export function useDocuments(businessId: string) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/documents?businessId=${encodeURIComponent(businessId)}`);
      if (!res.ok) throw new Error("Failed to load documents");
      const { documents: data } = await res.json();
      setDocuments(data as DocumentItem[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load documents";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadDocuments();
    }
  }, [loadDocuments]);

  return { documents, loading, error, reload: loadDocuments };
}