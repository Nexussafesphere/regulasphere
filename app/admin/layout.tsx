"use client";

import { type ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

interface AdminPageHeading {
  title: string;
  subtitle: string;
}

const ADMIN_PAGE_HEADINGS: Record<string, AdminPageHeading> = {
  "/admin": { title: "Admin Dashboard", subtitle: "RegulaSphere Governance & Compliance Console" },
  "/admin/ai": { title: "AI Training Data", subtitle: "Review and validate training examples" },
  "/admin/ai/training": { title: "Training Pipeline", subtitle: "Training job availability and status" },
  "/admin/alerts": { title: "System Alerts", subtitle: "Manage platform-wide notices" },
  "/admin/audit": { title: "Audit Logs", subtitle: "Review administrator activity" },
  "/admin/businesses": { title: "Businesses", subtitle: "Review registered business accounts" },
  "/admin/consultants": { title: "Consultants", subtitle: "Manage consultant profiles" },
  "/admin/consultants/verify": { title: "Consultant Verification", subtitle: "Review credentials and verification status" },
  "/admin/documents": { title: "Document Review", subtitle: "Review uploaded compliance documents" },
  "/admin/marketplace": { title: "Marketplace Moderation", subtitle: "Review consultant marketplace listings" },
  "/admin/obligations": { title: "Compliance Obligations", subtitle: "Manage regulatory obligations" },
  "/admin/regulators": { title: "Regulators", subtitle: "Browse regulatory authorities" },
  "/admin/reports": { title: "Reports & Analytics", subtitle: "Platform activity and compliance trends" },
  "/admin/settings": { title: "Admin Settings", subtitle: "Configure platform preferences" },
  "/admin/users": { title: "Users", subtitle: "Manage platform accounts" },
};

function getAdminPageHeading(pathname: string): AdminPageHeading {
  const heading = ADMIN_PAGE_HEADINGS[pathname];
  if (heading) return heading;
  if (pathname.startsWith("/admin/businesses/")) {
    return { title: "Business Details", subtitle: "Business profile and compliance status" };
  }
  if (pathname.startsWith("/admin/consultants/")) {
    return { title: "Consultant Details", subtitle: "Profile, credentials, and assignments" };
  }
  if (pathname.startsWith("/admin/documents/")) {
    return { title: "Document Details", subtitle: "Review document information and status" };
  }
  if (pathname.startsWith("/admin/obligations/")) {
    return { title: "Obligation Details", subtitle: "Review obligation requirements" };
  }
  if (pathname.startsWith("/admin/users/")) {
    return { title: "User Details", subtitle: "Account profile and access" };
  }
  return { title: "Admin Console", subtitle: "RegulaSphere Governance & Compliance Console" };
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const pageHeading = getAdminPageHeading(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)");
    const updateViewport = () => setIsDesktop(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const handleNavigationToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed((previous) => !previous);
      return;
    }
    setSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    if (isDesktop) {
      setSidebarCollapsed(true);
      return;
    }
    setSidebarOpen(false);
  };

  return (
    <div className="bg-off-white min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 shrink-0 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        <AdminSidebar setSidebarOpen={closeSidebar} />
      </aside>

      <div
        className={`admin-content-offset flex min-h-screen flex-col ${sidebarCollapsed ? "is-collapsed" : ""}`}
      >
        <AdminHeader
          title={pageHeading.title}
          subtitle={pageHeading.subtitle}
          onMenuClick={handleNavigationToggle}
          sidebarOpen={isDesktop ? !sidebarCollapsed : sidebarOpen}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        <main className="admin-main admin-dashboard flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}