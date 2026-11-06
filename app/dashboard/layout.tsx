"use client";

import { type ReactNode, useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    return segments.slice(1).map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    ).join(" / ");
  };

  return (
    <div className="min-h-screen bg-off-white w-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar wrapper */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 w-64
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          
        <Sidebar
          userType="Business"
          userName={user?.full_name || "Business User"}
          businessName="Dashboard"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main content */}
      <div className="dashboard-content-offset min-h-screen w-full">
        <div className="dashboard-topbar px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0 lg:hidden"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-sm sm:text-base font-semibold truncate">{getPageTitle()}</p>
        </div>
        <main className="dashboard-content p-4 sm:p-6 w-full max-w-full">{children}</main>
      </div>
    </div>
  );
}