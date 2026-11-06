"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = pathname === "/consultant"
    ? "Consultant Dashboard"
    : pathname
        .split("/")
        .filter(Boolean)
        .slice(1)
        .map((segment) => segment.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()))
        .join(" / ");

  return (
    <div className="bg-off-white min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 shrink-0 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          userType="Consultant"
          userName={user?.full_name || "Consultant"}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      <div className="dashboard-content-offset min-h-screen w-full">
        <header className="dashboard-topbar sticky top-0 z-30 flex items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-black/5 lg:hidden"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="truncate text-sm font-semibold sm:text-base">{pageTitle}</p>
        </header>
        <main className="dashboard-content w-full max-w-full p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}