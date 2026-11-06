"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/auth";

interface NavLink {
  name: string;
  href: string;
}

// Always show ALL public links regardless of auth state
const PUBLIC_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Privacy", href: "/privacy" },
  { name: "Contact", href: "/contact" },
];

const ADMIN_EMAILS = ["nexussafesphere@outlook.com", "nexusafesphere@outlook.com"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always show all public links
  const links = PUBLIC_LINKS;
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    setIsOpen(false);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const isDashboardArea =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/consultant") ||
    pathname.startsWith("/regulator") ||
    pathname.startsWith("/admin");

  if (isDashboardArea) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-navy backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-navy border-b border-white/10"
      }`}
    >
      <div className="container flex items-center gap-2 h-16 md:h-20 px-4 w-full">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo/regulasphere-logo.png"
            alt="RegulaSphere"
            width={120}
            height={28}
            className="object-contain w-auto h-7 md:h-8"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={handleBack}
          className="btn btn-ghost btn-sm shrink-0 px-2 md:px-3 text-[#D4C5A9] hover:text-white"
          aria-label="Go back to the previous page"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Desktop Navigation - Always shows Home, About, Privacy, Contact */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 ml-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm lg:text-base ${
                pathname === link.href ? "text-gold" : "text-sand"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPagesOpen((open) => !open)}
              className="btn btn-ghost btn-sm text-sand hover:text-white"
              aria-expanded={isPagesOpen}
              aria-haspopup="menu"
            >
              Pages <ChevronDown className={`w-4 h-4 transition-transform ${isPagesOpen ? "rotate-180" : ""}`} />
            </button>
            {isPagesOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-xl border border-white/10 bg-navy p-2 shadow-xl" role="menu">
                {links.map((link) => (
                  <Link
                    key={`menu-${link.href}`}
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm text-sand hover:bg-white/10 hover:text-white"
                    onClick={() => setIsPagesOpen(false)}
                    role="menuitem"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && !pathname.startsWith("/admin") && (
                <Link
                  href="/admin"
                  className="btn btn-ghost btn-sm flex items-center gap-1 text-[#D4C5A9] hover:text-[#D4AF37]"
                >
                  <Shield className="w-3 h-3" /> Admin
                </Link>
              )}
              {!isDashboardArea && (
                <Link
                  href="/dashboard"
                  className="btn btn-ghost btn-sm flex items-center gap-1 text-[#D4C5A9] hover:text-[#D4AF37]"
                >
                  <LayoutDashboard className="w-3 h-3" /> Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm flex items-center gap-1 text-[#D4C5A9] hover:text-red-400"
              >
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-ghost btn-sm text-[#D4C5A9] hover:text-[#D4AF37]"
              >
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto p-2 text-[#D4C5A9] hover:text-[#D4AF37] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-soft border-t border-white/10 px-4 py-4 w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#D4AF37] bg-[#D4AF37]/5"
                    : "text-[#D4C5A9] hover:text-[#D4AF37] hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 mt-4 pb-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="btn btn-secondary btn-sm w-full justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="btn btn-secondary btn-sm w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary btn-sm w-full justify-center"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="btn btn-secondary btn-sm w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary btn-sm w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}