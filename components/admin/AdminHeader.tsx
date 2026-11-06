"use client";

import { Bell, Menu, Shield, Sun, Moon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
  hideMenuOnDesktop?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

export default function AdminHeader({
  title,
  subtitle,
  onMenuClick,
  sidebarOpen = false,
  hideMenuOnDesktop = false,
  isDarkMode = false,
  onToggleTheme,
}: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications: NotificationItem[] = [];

  return (
    <header className="admin-topbar sticky top-0 z-30 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onMenuClick}
            className={`p-2 rounded-lg text-secondary hover:bg-off-white transition-colors focus:outline-none ${hideMenuOnDesktop ? "lg:hidden" : ""}`}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-navy">{title}</h1>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-secondary hover:bg-off-white transition-colors"
              aria-label="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-secondary" />}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-secondary hover:bg-off-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 top-12 z-20 w-80 rounded-lg border border-border bg-white shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-navy">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <Bell className="w-8 h-8 text-muted mx-auto mb-2" />
                      <p className="text-sm text-muted">No new notifications</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-off-white transition-colors">
                          <p className="text-sm text-navy">{n.message}</p>
                          <p className="text-xs text-muted mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-off-white transition-colors"
          >
            <div className="gold-gradient text-navy w-7 h-7 rounded-md flex items-center justify-center shadow-sm">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-navy leading-none">Super Admin</p>
              <p className="text-[10px] text-muted mt-0.5">Console</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}