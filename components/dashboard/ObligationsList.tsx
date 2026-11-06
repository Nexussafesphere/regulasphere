"use client";

import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

interface Obligation {
  id: string;
  title: string;
  regulator: string;
  status: string;
  priority?: string;
  deadline?: string;
  category?: string;
}

interface ObligationsListProps {
  obligations: Obligation[];
  onStatusChange?: (id: string, status: string) => void;
}

export default function ObligationsList({
  obligations,
  onStatusChange,
}: ObligationsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "Overdue":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "Under Review":
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted" />;
    }
  };

  const getPriorityBadge = (priority: string | undefined) => {
    switch (priority) {
      case "Critical":
        return "badge badge-gold";
      case "High":
        return "badge badge-outline";
      default:
        return "badge badge-silver";
    }
  };

  return (
    <div className="space-y-3">
      {obligations.map((obligation) => (
        <div key={obligation.id} className="card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-navy">
                  {obligation.title}
                </h3>
                <span className={getPriorityBadge(obligation.priority)}>
                  {obligation.priority || "Medium"}
                </span>
              </div>
              <p className="text-xs text-muted">
                {obligation.regulator} | {obligation.category || "General"} |
                Due: {obligation.deadline || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {getStatusIcon(obligation.status)}
              <span className="text-xs font-medium text-navy">
                {obligation.status}
              </span>
              {onStatusChange && (
                <select
                  value={obligation.status}
                  onChange={(e) =>
                    onStatusChange(obligation.id, e.target.value)
                  }
                  className="select w-32"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Under Review">Under Review</option>
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}