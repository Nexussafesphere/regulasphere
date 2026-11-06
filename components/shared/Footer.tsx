"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FooterLink {
  name: string;
  href: string;
}

const companyLinks: FooterLink[] = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
];

const platformLinks: FooterLink[] = [
  { name: "Business", href: "/register?type=business" },
  { name: "Consultant", href: "/register?type=consultant" },
  { name: "Regulator", href: "/register?type=regulator" },
];

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/consultant") ||
    pathname.startsWith("/regulator") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="bg-navy text-silver w-full">
      <div className="container py-10 md:py-16 px-4 w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 w-full">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo/regulasphere-logo.png"
              alt="RegulaSphere"
              width={120}
              height={28}
              className="object-contain mb-4 w-auto h-7"
            />
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              AI-powered compliance for Nigerian businesses.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </p>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-silver hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="truncate">Abuja, Nigeria</li>
              <li className="truncate">
                <a
                  href="mailto:nexusafesphere@outlook.com"
                  className="hover:text-gold transition-colors"
                >
                  nexusafesphere@outlook.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+2348076217098"
                  className="hover:text-gold transition-colors"
                >
                  +234 807 621 7098
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-8 md:mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <p className="text-xs text-muted text-center md:text-left">
            RegulaSphere is a product of Nexus SafeSphere Technologies Limited.
          </p>
          <Image
            src="/images/logo/nexus-logo.png"
            alt="Nexus SafeSphere Technologies"
            width={80}
            height={20}
            className="object-contain opacity-60 hover:opacity-100 transition-opacity w-auto h-5"
          />
        </div>
      </div>
    </footer>
  );
}