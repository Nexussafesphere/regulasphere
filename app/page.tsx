"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Bot,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Building2,
  Landmark,
  Info,
  Mail,
  Lock,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    image: "/images/features/ai-agent.jpg",
    title: "AI Compliance Agent",
    description:
      "Llama 3 translates complex regulations into simple, actionable steps.",
  },
  {
    image: "/images/features/compliance-tracker.jpg",
    title: "Proactive Alerts",
    description: "Never miss a deadline. Get notified before penalties hit.",
  },
  {
    image: "/images/features/consultant-marketplace.jpg",
    title: "Consultant Marketplace",
    description:
      "Connect with DPCOs, tax experts, and AI governance specialists.",
  },
  {
    image: "/images/features/regulator-dashboard.jpg",
    title: "SupTech Dashboard",
    description:
      "Regulators get anonymized compliance analytics for better oversight.",
  },
  {
    image: "/images/features/document-verification.jpg",
    title: "Document Verification",
    description:
      "Upload compliance documents and get verified by certified consultants.",
  },
  {
    image: "/images/features/compliance-report.png",
    title: "Compliance Reports",
    description: "Generate and print audit-ready reports in one click.",
  },
];

const STATS = [
  { value: "10+", label: "Regulators Monitored", icon: Landmark },
  { value: "40M+", label: "Nigerian SMEs", icon: Building2 },
  { value: "₦30M", label: "Max Fine Avoided", icon: Shield },
  { value: "24/7", label: "AI Monitoring", icon: Bot },
];

const REGULATORS = [
  "NDPC", "NITDA", "CAC", "NRS", "CBN",
  "SEC", "PENCOM", "ITF", "NSITF", "NAFDAC",
];

const STEPS = [
  {
    number: "01",
    title: "Onboard",
    description: "Tell us about your business sector, size, and operations.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Llama 3 generates your personalized compliance roadmap.",
  },
  {
    number: "03",
    title: "Stay Compliant",
    description: "Track deadlines, verify documents, and print reports.",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* QUICK NAVIGATION */}
      <section className="bg-[#3B4218] border-b border-[#D4AF37]/30 w-full">
        <div className="container flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4 py-4 w-full">
          <Link href="/about" className="btn btn-ghost btn-sm border border-[#D4C5A9]/30 text-[#D4C5A9] hover:border-[#D4AF37] hover:text-white">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link href="/contact" className="btn btn-ghost btn-sm border border-[#D4C5A9]/30 text-[#D4C5A9] hover:border-[#D4AF37] hover:text-white">
            <Mail className="w-4 h-4" /> Contact
          </Link>
          <Link href="/privacy" className="btn btn-ghost btn-sm border border-[#D4C5A9]/30 text-[#D4C5A9] hover:border-[#D4AF37] hover:text-white">
            <Lock className="w-4 h-4" /> Privacy
          </Link>
          <Link href="/signin" className="btn btn-secondary btn-sm">
            <LogIn className="w-4 h-4" /> Sign in
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </section>
      {/* HERO SECTION */}
      <section className="bg-[#2C3210] text-white relative overflow-hidden border-b-4 border-[#D4AF37] w-full">
        <div className="pointer-events-none absolute inset-0 opacity-[0.20]">
          <Image
            src="/images/hero/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#2C3210]/70 via-transparent to-[#2C3210]/70" />

        <div className="pointer-events-none absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-[#D4AF37]/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div
          className="pointer-events-none absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-[#D4C5A9]/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container relative py-16 md:py-24 lg:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
            {/* Left column - Text content */}
            <div className="text-center md:text-left w-full">
              <span className="badge badge-gold mb-4 md:mb-6 border border-[#D4AF37]/30 inline-flex">
                <Shield className="w-3 h-3 shrink-0" />
                <span className="truncate">Powered by Meta Llama 3</span>
              </span>

              <h1 className="text-white mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Stay compliant.{" "}
                <span className="text-gold-gradient">Stay ahead.</span>
              </h1>

              <p className="text-[#D4C5A9] text-base sm:text-lg md:text-xl mb-8 md:mb-10 leading-relaxed max-w-full md:max-w-xl">
                Your AI compliance partner - always on. Monitoring Nigerian
                regulations 24/7 so you never get fined again.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 md:justify-start justify-center w-full">
                {/* Start Free Trial - ALWAYS VISIBLE */}
                <Link
                  href="/register"
                  className="btn btn-primary btn-lg flex items-center gap-2 shadow-xl hover:shadow-2xl justify-center w-full sm:w-auto"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                {/* Go to Dashboard - Only when authenticated */}
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="btn btn-secondary btn-lg flex items-center gap-2 justify-center w-full sm:w-auto border-[#D4C5A9]/50 text-[#D4C5A9] hover:bg-[#D4C5A9]/10 hover:border-[#D4AF37]"
                  >
                    Go to Dashboard
                  </Link>
                )}

                <Link
                  href="/about"
                  className="btn btn-ghost btn-lg border border-[#D4C5A9]/20 hover:border-[#D4AF37] justify-center w-full sm:w-auto"
                  style={{ color: "var(--silver)" }}
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right column - Hero image */}
            <div className="w-full">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl w-full max-w-full">
                <Image
                  src="/images/hero/hero-dashboard.jpg"
                  alt="RegulaSphere Dashboard"
                  width={800}
                  height={500}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white border-b border-border w-full">
        <div className="container py-10 md:py-14 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-full lg:max-w-4xl mx-auto w-full">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-linear-to-b from-white to-off-white hover:border-[#D4AF37]/50 hover:shadow-lg transition-all duration-300 w-full"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto gold-gradient rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 shadow-md">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#2C3210]" />
                  </div>
                  <p
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C3210] mb-1"
                    style={{ fontFamily: "var(--heading-font)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted leading-tight">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REGULATORS STRIP */}
      <section className="bg-off-white border-b border-border w-full">
        <div className="container py-8 md:py-10 w-full">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-xs sm:text-sm font-semibold text-[#2C3210] uppercase tracking-wider">
              Monitoring in real-time
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-full md:max-w-2xl mx-auto px-2">
            {REGULATORS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white border border-border shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all duration-300 text-xs md:text-sm font-semibold text-[#2C3210] whitespace-nowrap"
                style={{ fontFamily: "var(--heading-font)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section-padding bg-white w-full">
        <div className="container w-full">
          <div className="text-center max-w-full md:max-w-2xl mx-auto mb-10 md:mb-16 px-2">
            <span className="badge badge-outline mb-3 md:mb-4">Features</span>
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">
              Everything you need to stay compliant
            </h2>
            <p className="text-secondary text-sm md:text-base">
              One platform for businesses, consultants, and regulators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-in w-full">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="card text-center bg-white border border-border hover:border-[#D4AF37]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full h-full"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-xl md:rounded-2xl overflow-hidden border border-border shadow-md">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="mb-2 md:mb-3 text-base sm:text-lg md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding bg-off-white border-y border-border w-full">
        <div className="container w-full">
          <div className="text-center max-w-full md:max-w-2xl mx-auto mb-10 md:mb-16 px-2">
            <span className="badge badge-outline mb-3 md:mb-4">How it works</span>
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">
              Three simple steps
            </h2>
            <p className="text-secondary text-sm md:text-base">
              Get started in minutes, not months.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-full md:max-w-3xl mx-auto w-full">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center w-full">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 mx-auto gold-gradient rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-xl"
                  style={{ fontFamily: "var(--heading-font)" }}
                >
                  <span className="text-lg md:text-xl font-bold text-[#2C3210]">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 md:mb-3 text-base sm:text-lg md:text-xl">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#2C3210] section-padding border-t-4 border-[#D4AF37] w-full">
        <div className="container text-center max-w-full md:max-w-xl mx-auto px-2 w-full">
          <h2 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Never get fined again
          </h2>
          <p className="text-[#D4C5A9] mb-8 md:mb-10 text-base md:text-lg">
            Join businesses using RegulaSphere to navigate compliance with
            confidence.
          </p>
          <Link
                  href="/register"
            className="btn btn-primary btn-lg inline-flex items-center gap-2 shadow-xl hover:shadow-2xl justify-center"
          >
            Get Started Free <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white py-8 md:py-12 border-t border-border w-full">
        <div className="container flex flex-wrap justify-center gap-2 md:gap-4 max-w-full md:max-w-3xl mx-auto px-2 w-full">
          {[
            "NDPA 2023 Compliant",
            "CAMA 2020 Aligned",
            "NITDA AI Framework Ready",
            "Data Sovereignty in Nigeria",
          ].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-xs md:text-sm text-secondary px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-border bg-off-white hover:border-[#D4AF37]/50 transition-all whitespace-nowrap"
            >
              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#D4AF37] shrink-0" />
              {badge}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}