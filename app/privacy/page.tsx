"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Lock,
  Database,
  Globe,
  CheckCircle2,
  ArrowRight,
  Eye,
  UserCheck,
  Mail,
} from "lucide-react";

const SECTIONS = [
  {
    id: "1",
    icon: Shield,
    title: "Introduction",
    content:
      "This Privacy Policy explains how Nexus SafeSphere Technologies Limited, operating RegulaSphere, collects, uses, stores, shares, and protects personal data. It applies to our website, application, communications, and related services.",
  },
  {
    id: "2",
    icon: Database,
    title: "Data We Collect",
    content:
      "We may collect identity and contact details, business and account information, compliance documents, support messages, device and log data, and information you provide when using our AI compliance tools. We collect only information reasonably necessary for the stated purpose.",
  },
  {
    id: "3",
    icon: CheckCircle2,
    title: "Lawful Processing and NDPA 2023",
    content:
      "We process personal data on a lawful basis such as consent, performance of a contract, compliance with a legal obligation, or our legitimate interests. Our controls are designed around the Nigeria Data Protection Act 2023, applicable NDPC guidance, privacy by design, purpose limitation, data minimisation, accuracy, storage limitation, confidentiality, and accountability. This policy does not replace any required notice or consent.",
  },
  {
    id: "4",
    icon: UserCheck,
    title: "Your Rights",
    content:
      "Subject to applicable law, you may request access, correction, deletion, restriction, portability, objection to processing, withdrawal of consent, and review of certain automated decisions. You may also lodge a complaint with the Nigeria Data Protection Commission. We verify requests and respond within the period required by law.",
  },
  {
    id: "5",
    icon: Lock,
    title: "Security and Breach Response",
    content:
      "We use access controls, encryption where appropriate, secure configuration, logging, backups, staff confidentiality obligations, and risk-based reviews to protect personal data. If a personal data breach creates a risk to individuals, we will assess, contain, document, and notify the NDPC and affected individuals where required by applicable law.",
  },
  {
    id: "6",
    icon: Database,
    title: "Retention and Service Providers",
    content:
      "We retain personal data only for as long as needed for the purpose collected, legal obligations, dispute resolution, security, and legitimate business records. We may use vetted hosting, analytics, communications, security, and infrastructure providers under written obligations covering confidentiality and appropriate data protection safeguards.",
  },
  {
    id: "7",
    icon: Globe,
    title: "International Transfers",
    content:
      "Where personal data is accessed or processed outside Nigeria, we use a lawful transfer mechanism and safeguards required by the NDPA and applicable NDPC rules, such as adequacy, contractual protections, transfer assessments, or another recognised legal basis. We do not sell personal data.",
  },
  {
    id: "8",
    icon: Eye,
    title: "Global Privacy Principles",
    content:
      "For users in other jurisdictions, we also apply globally recognised principles reflected in the GDPR and similar laws: transparency, fairness, purpose limitation, data minimisation, accuracy, security, accountability, and meaningful rights. Where another law gives you stronger rights, those rights may apply.",
  },
  {
    id: "9",
    icon: Shield,
    title: "Children and Updates",
    content:
      "Our services are intended for businesses and are not directed to children. We do not knowingly collect children's personal data without appropriate legal authorisation. We may update this policy when our services or legal obligations change and will publish the revised date and material changes.",
  },
  {
    id: "10",
    icon: Mail,
    title: "Contact the Data Protection Team",
    content: "For privacy requests, complaints, or questions, contact nexusafesphere@outlook.com. Please do not send passwords or highly sensitive information by email.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white py-24 relative overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 opacity-[0.15]">
          <Image
            src="/images/pages/privacy-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-navy/80 via-navy/60 to-navy/80" />
        <div className="container relative text-center">
          <span className="badge badge-gold mb-6 border border-gold/30">
            <Shield className="w-3 h-3" /> Legal
          </span>
          <h1 className="text-white mb-4">Privacy Policy</h1>
          <p className="text-silver text-sm">Last updated: August 2026</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding bg-off-white">
        <div className="container max-w-3xl">
          <div className="space-y-6 stagger-in">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="card bg-white border border-border hover:border-gold/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 gold-gradient rounded-xl flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2">
                        {section.id}. {section.title}
                      </h3>
                      <p className="text-sm text-secondary leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="card bg-linear-to-b from-gold/10 to-transparent border border-gold/30">
              <CheckCircle2 className="w-10 h-10 text-gold mx-auto mb-3" />
              <h3 className="mb-2">Questions about your data?</h3>
              <p className="text-sm text-secondary mb-4">We are here to help.</p>
              <Link
                href="/contact"
                className="btn btn-primary btn-sm flex items-center gap-2"
              >
                Contact Us <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}