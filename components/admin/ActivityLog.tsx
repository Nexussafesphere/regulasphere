"use client";

import { Activity, User, Building2, FileText, Shield, Bell, Bot, Settings } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ActivityLogProps {
  activities: Array<{
    id: string;
    admin_email: string | null;
    activity_type: string;
    description: string | null;
    created_at: string;
  }>;
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "user":
        return <User className="w-4 h-4 text-(--army-green)" />;
      case "business":
        return <Building2 className="w-4 h-4 text-(--army-green-light)" />;
      case "document":
        return <FileText className="w-4 h-4 text-(--army-green)" />;
      case "verification":
        return <Shield className="w-4 h-4 text-gold" />;
      case "alert":
        return <Bell className="w-4 h-4 text-red-600" />;
      case "ai":
        return <Bot className="w-4 h-4 text-(--gold-dark)" />;
      case "settings":
        return <Settings className="w-4 h-4 text-muted" />;
      default:
        return <Activity className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white/70">
      <div className="divide-y divide-border">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="px-5 py-4 transition-colors hover:bg-off-white sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--army-green-pale)">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="wrap-break-words text-sm leading-6 text-navy">
                    <span className="font-medium">{activity.admin_email || "System"}</span>{" "}
                    {activity.description || activity.activity_type}
                  </p>
                  <p className="text-xs text-muted mt-1">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}