"use client";

import { Bell, Bot, AlertTriangle, FileText, BarChart3, Shield } from "lucide-react";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at?: string;
}

interface AIInsightsFeedProps {
  activities: Activity[];
  maxItems?: number;
}

export default function AIInsightsFeed({
  activities,
  maxItems = 5,
}: AIInsightsFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Alert":
        return <Bell className="w-4 h-4 text-gold" />;
      case "Recommendation":
        return <Bot className="w-4 h-4 text-blue-500" />;
      case "Risk Assessment":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "Document Check":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "Analysis":
        return <BarChart3 className="w-4 h-4 text-teal-500" />;
      case "Scan":
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <Bot className="w-4 h-4 text-gold" />;
    }
  };

  return (
    <div className="space-y-2">
      {activities.slice(0, maxItems).map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 py-2 border-b border-border last:border-b-0"
        >
          <span className="shrink-0 mt-0.5">
            {getIcon(activity.activity_type)}
          </span>
          <p className="text-xs text-secondary leading-relaxed">
            {activity.description}
          </p>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-xs text-muted">No AI insights yet.</p>
      )}
    </div>
  );
}