"use client";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.error || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export const apiClient = {
  chat: (data: {
    message: string;
    businessId?: string;
    businessContext?: Record<string, unknown>;
    language?: string;
  }) => apiRequest<{ response: string }>("/api/chat", {
    method: "POST",
    body: data,
  }),

  analyzeBusiness: (business: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>("/api/analyze-business", {
      method: "POST",
      body: { business },
    }),

  onboarding: (data: {
    businessId: string;
    businessProfile: Record<string, unknown>;
  }) => apiRequest<Record<string, unknown>>("/api/onboarding", {
    method: "POST",
    body: data,
  }),

  translate: (data: {
    text: string;
    targetLanguage: string;
    includeSpeech?: boolean;
  }) => apiRequest<Record<string, unknown>>("/api/translate", {
    method: "POST",
    body: data,
  }),

  getReports: (businessId: string) =>
    apiRequest<{ reports: unknown[] }>(`/api/reports?businessId=${businessId}`),

  generateReport: (businessId: string, reportType: string) =>
    apiRequest<Record<string, unknown>>("/api/reports", {
      method: "POST",
      body: { businessId, reportType },
    }),

  getDocuments: (businessId: string) =>
    apiRequest<{ documents: unknown[] }>(
      `/api/documents?businessId=${businessId}`
    ),

  uploadDocument: (data: {
    businessId: string;
    documentName: string;
    documentType: string;
    obligationId?: string;
  }) => apiRequest<Record<string, unknown>>("/api/documents", {
    method: "POST",
    body: data,
  }),

  verifyDocument: (data: {
    documentId: string;
    consultantId: string;
    status: string;
    notes?: string;
  }) => apiRequest<Record<string, unknown>>("/api/documents", {
    method: "PATCH",
    body: data,
  }),

  getAlerts: () => apiRequest<{ alerts: unknown[] }>("/api/alerts"),

  createAlert: (data: {
    title: string;
    regulator?: string;
    severity?: string;
    summary?: string;
  }) => apiRequest<Record<string, unknown>>("/api/alerts", {
    method: "POST",
    body: data,
  }),
};