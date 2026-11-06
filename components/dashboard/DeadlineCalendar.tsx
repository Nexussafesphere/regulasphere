"use client";

import { CalendarDays } from "lucide-react";

interface Deadline {
  id: string;
  title: string;
  regulator: string;
  deadline: string;
  priority?: string;
}

interface DeadlineCalendarProps {
  deadlines: Deadline[];
  days?: number;
}

export default function DeadlineCalendar({
  deadlines,
  days = 30,
}: DeadlineCalendarProps) {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const upcoming = deadlines.filter((d) => {
    const due = new Date(d.deadline);
    return due >= now && due <= future;
  });

  const sorted = [...upcoming].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="space-y-2">
      {sorted.map((deadline) => {
        const daysUntil = Math.ceil(
          (new Date(deadline.deadline).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={deadline.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold" />
              <div>
                <p className="text-xs font-medium text-navy">
                  {deadline.title}
                </p>
                <p className="text-xs text-muted">{deadline.regulator}</p>
              </div>
            </div>
            <span
              className={`text-xs font-medium ${
                daysUntil <= 7 ? "text-red-500" : "text-secondary"
              }`}
            >
              {daysUntil === 0
                ? "Today"
                : daysUntil === 1
                ? "Tomorrow"
                : `${daysUntil} days`}
            </span>
          </div>
        );
      })}
      {sorted.length === 0 && (
        <p className="text-xs text-muted">No upcoming deadlines.</p>
      )}
    </div>
  );
}