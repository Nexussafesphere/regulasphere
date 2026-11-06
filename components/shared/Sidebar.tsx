"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  CheckCircle2,
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

const BUSINESS_NAVIGATION: NavSection[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Obligations", href: "/dashboard/obligations", icon: CheckCircle2 },
      { name: "Documents", href: "/dashboard/documents", icon: FileText },
      { name: "Consultants", href: "/dashboard/consultants", icon: Users },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    title: "AI",
    items: [{ name: "AI Assistant", href: "/dashboard/chat", icon: Bot }],
  },
  {
    title: "System",
    items: [
      { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

const CONSULTANT_NAVIGATION: NavSection[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/consultant", icon: LayoutDashboard },
      { name: "Clients", href: "/consultant/clients", icon: Users },
      { name: "Verify Documents", href: "/consultant/verify", icon: FileText },
      { name: "Assignments", href: "/consultant/assignments", icon: CheckCircle2 },
    ],
  },
  {
    title: "System",
    items: [{ name: "Settings", href: "/consultant/settings", icon: Settings }],
  },
];

const REGULATOR_NAVIGATION: NavSection[] = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/regulator", icon: LayoutDashboard },
      { name: "Analytics", href: "/regulator/analytics", icon: BarChart3 },
      { name: "Watchlist", href: "/regulator/watchlist", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [{ name: "Settings", href: "/regulator/settings", icon: Settings }],
  },
];

export type UserType = "Business" | "Consultant" | "Regulator";

function getNavigation(userType: UserType): NavSection[] {
  switch (userType) {
    case "Business":
      return BUSINESS_NAVIGATION;
    case "Consultant":
      return CONSULTANT_NAVIGATION;
    case "Regulator":
      return REGULATOR_NAVIGATION;
    default:
      return BUSINESS_NAVIGATION;
  }
}

interface SidebarProps {
  userType: UserType;
  userName: string;
  businessName?: string;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({
  userType,
  userName,
  businessName,
  setSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Main: true,
    AI: true,
    System: true,
  });

  const navigation = getNavigation(userType);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (href: string) => {
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

  return (
    <div className="dashboard-sidebar-shell h-full w-64 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <Link href="/" className="shrink-0" onClick={() => setSidebarOpen?.(false)}>
          <Image
            src="/images/logo/regulasphere-logo.png"
            alt="RegulaSphere"
            width={120}
            height={28}
            className="object-contain"
          />
        </Link>
        <button
          onClick={() => setSidebarOpen?.(false)}
          className="dashboard-sidebar-close p-1.5 rounded transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/10 shrink-0">
        <p className="text-sm font-semibold text-white truncate">{userName}</p>
        {businessName && (
          <p className="text-xs text-[#C8D6CF] truncate mt-0.5">{businessName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-2">
            <button
              onClick={() => toggleSection(section.title)}
                aria-expanded={expandedSections[section.title]}
                className="dashboard-sidebar-section w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-normal transition-colors"
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
                      onClick={() => setSidebarOpen?.(false)}
                      aria-current={active ? "page" : undefined}
                      className={`dashboard-sidebar-link flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg mx-2 ${
                        active
                          ? "is-active"
                          : ""
                      }`}
                    >
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

      {/* Logout */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <button
          onClick={handleLogout}
          className="dashboard-sidebar-logout flex items-center gap-3 w-full py-2.5 text-sm transition-colors rounded-lg"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}