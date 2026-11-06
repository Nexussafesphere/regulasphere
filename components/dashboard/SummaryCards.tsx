"use client";

import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

interface SummaryData {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  pendingDocuments: number;
}

interface SummaryCardsProps {
  data: SummaryData;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="card text-center py-6">
        <LayoutDashboard className="w-6 h-6 text-gold mx-auto mb-2" />
        <p className="text-2xl font-bold text-navy mb-1">{data.total}</p>
        <p className="text-xs text-muted">Total Obligations</p>
      </div>

      <div className="card text-center py-6">
        <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-green-600 mb-1">
          {data.completed}
        </p>
        <p className="text-xs text-muted">Completed</p>
      </div>

      <div className="card text-center py-6">
        <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-amber-500 mb-1">
          {data.inProgress}
        </p>
        <p className="text-xs text-muted">In Progress</p>
      </div>

      <div className="card text-center py-6">
        <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-red-500 mb-1">{data.overdue}</p>
        <p className="text-xs text-muted">Overdue</p>
      </div>

      <div className="card text-center py-6">
        <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-blue-500 mb-1">
          {data.pendingDocuments}
        </p>
        <p className="text-xs text-muted">Pending Documents</p>
      </div>
    </div>
  );
}