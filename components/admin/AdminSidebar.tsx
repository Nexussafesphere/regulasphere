"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Bot,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Building2,
  UserCheck,
  Landmark,
  ClipboardList,
  Store,
  ScrollText,
  X,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMIN_NAVIGATION: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Businesses", href: "/admin/businesses", icon: Building2 },
      { name: "Consultants", href: "/admin/consultants", icon: UserCheck },
      { name: "Regulators", href: "/admin/regulators", icon: Landmark },
    ],
  },
  {
    title: "Verification",
    items: [
      { name: "Documents", href: "/admin/documents", icon: FileText },
      { name: "Consultant Review", href: "/admin/consultants/verify", icon: Shield },
    ],
  },
  {
    title: "Compliance",
    items: [
      { name: "Obligations", href: "/admin/obligations", icon: ClipboardList },
      { name: "Marketplace", href: "/admin/marketplace", icon: Store },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Alerts", href: "/admin/alerts", icon: Bell },
      { name: "AI Training Data", href: "/admin/ai", icon: Bot },
      { name: "Audit Logs", href: "/admin/audit", icon: ScrollText },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Overview: true,
    Management: true,
    Verification: true,
    Compliance: true,
    System: true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try {
      const mod = await import("@/lib/auth");
      await mod.logoutUser();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const handleClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-sidebar-shell h-full w-full flex flex-col justify-between">
      <div className="min-h-0 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <Link href="/admin" className="shrink-0" onClick={handleClose}>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo/regulasphere-logo.png"
                alt="RegulaSphere"
                width={110}
                height={26}
                className="object-contain"
              />
              <span className="badge badge-gold">Admin</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3.5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="gold-gradient text-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[11px] text-white/85 truncate mt-0.5">{user?.email || "Admin account"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {ADMIN_NAVIGATION.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                aria-expanded={expandedSections[section.title]}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-normal text-[#f2d783] hover:text-white transition-colors"
              >
                <span className="truncate">{section.title}</span>
                {expandedSections[section.title] ? (
                  <ChevronDown className="w-3 h-3 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 shrink-0" />
                )}
              </button>

              {expandedSections[section.title] && (
                <div className="space-y-0.5 mt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleClose}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex items-center gap-3 rounded-lg pl-4 pr-3 py-2.5 text-sm font-medium transition-colors ${
                          active ? "is-active" : ""
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-r-full bg-(--gold)" />
                        )}
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors rounded-lg"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}