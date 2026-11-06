"use client";

import { Database, Server, Globe, Cpu, CheckCircle, XCircle } from "lucide-react";

interface SystemHealthProps {
  stats: {
    database: boolean;
    api: boolean;
    storage: boolean;
    ai: boolean;
  };
}

export default function SystemHealth({ stats }: SystemHealthProps) {
  const services = [
    { name: "Database", icon: Database, status: stats.database },
    { name: "API Services", icon: Server, status: stats.api },
    { name: "Storage", icon: Globe, status: stats.storage },
    { name: "AI Engine", icon: Cpu, status: stats.ai },
  ];

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold text-navy">System Health</h3>
      </div>
      <div className="px-5 py-2 sm:px-6">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              className={`flex items-center justify-between py-3.5 ${
                i !== services.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="gold-gradient text-navy flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-navy">{service.name}</span>
              </div>
              {service.status ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Operational
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 ring-1 ring-red-100 px-2 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5" />
                  Down
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}