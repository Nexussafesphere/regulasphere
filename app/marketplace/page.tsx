"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Lock, Database, Globe, CheckCircle2, ArrowRight, Eye, UserCheck } from "lucide-react";

const SECTIONS = [
  { id: "1", icon: Shield, title: "Introduction", content: "RegulaSphere, a product of Nexus SafeSphere Technologies Limited, is committed to protecting your privacy. This policy explains how we collect, use, and protect your data." },
  { id: "2", icon: Database, title: "Data We Collect", content: "We collect business information during onboarding, compliance documents you upload, and usage data to improve our services." },
  { id: "3", icon: Lock, title: "NDPA 2023 Compliance", content: "RegulaSphere is fully compliant with the Nigeria Data Protection Act (NDPA) 2023. We implement appropriate technical and organizational measures to protect personal data." },
  { id: "4", icon: Globe, title: "Data Sovereignty", content: "Critical compliance data is hosted in Nigeria. We comply with NDPC requirements for cross-border data transfers." },
  { id: "5", icon: UserCheck, title: "Your Rights", content: "You have the right to access, correct, delete, and port your data as provided under NDPA 2023 Sections 34-36." },
  { id: "6", icon: Eye, title: "Contact", content: "For privacy inquiries, contact us at nexussafesphere@outlook.com" },
];

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b-4 border-gold w-full">
        <div className="absolute inset-0 opacity-[0.15]">
          <Image src="/images/pages/privacy-hero.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-navy/80 via-navy/60 to-navy/80" />
        <div className="container relative text-center px-4 w-full">
          <span className="badge badge-gold mb-4 md:mb-6 border border-gold/30">
            <Shield className="w-3 h-3 shrink-0" /> Legal
          </span>
          <h1 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">Privacy Policy</h1>
          <p className="text-silver text-sm">Last updated: August 2026</p>
        </div>
      </section>

      <section className="section-padding bg-off-white w-full">
        <div className="container max-w-full md:max-w-3xl px-4 w-full mx-auto">
          <div className="space-y-4 md:space-y-6 stagger-in w-full">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="card bg-white border border-border hover:border-gold/50 hover:shadow-lg transition-all duration-300 w-full">
                  <div className="flex items-start gap-3 md:gap-4 w-full">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 gold-gradient rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2 text-sm md:text-base">{section.id}. {section.title}</h3>
                      <p className="text-xs md:text-sm text-secondary leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 md:mt-12 w-full">
            <div className="card bg-linear-to-b from-gold/10 to-transparent border border-gold/30 w-full">
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-gold mx-auto mb-2 md:mb-3" />
              <h3 className="mb-2 text-base md:text-lg">Questions about your data?</h3>
              <p className="text-xs md:text-sm text-secondary mb-3 md:mb-4">We are here to help.</p>
              <Link href="/contact" className="btn btn-primary btn-sm inline-flex items-center gap-2">
                Contact Us <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}