"use client";

import { type ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "Business" | "Consultant" | "Regulator";
  userName: string;
  businessName?: string;
}

export default function DashboardLayout({
  children,
  userType,
  userName,
  businessName,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    return segments
      .map((segment) =>
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      )
      .join(" / ");
  };

  return (
    <div className="flex min-h-screen bg-off-white w-full max-w-full overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          userType={userType}
          userName={userName}
          businessName={businessName}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full">
        {/* Header */}
        <div className="border-b border-border bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 w-full">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-navy" />
          </button>
          <p className="text-sm sm:text-base font-semibold text-navy truncate">
            {getPageTitle()}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 w-full max-w-full">{children}</div>
      </main>
    </div>
  );
}