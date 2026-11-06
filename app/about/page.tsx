"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, ArrowRight, Globe, Lock, Scale } from "lucide-react";

const TEAM = [
  { image: "/images/team/zeenatudeen-yusuf.jpg", name: "Zeenatudeen Zubair Yusuf", role: "Team Lead", bio: "Product vision, business strategy, and regulatory research." },
  { image: "/images/team/innocent-ojisua.jpg", name: "Innocent Ojisua", role: "ML Engineer", bio: "Meta Llama 3 integration and AI agent development." },
  { image: "/images/team/precious-kulutuye.jpg", name: "Precious Kulutuye", role: "Researcher", bio: "Regulatory analysis, market validation, and data mapping." },
];

const VALUES = [
  { icon: Shield, title: "Trust", description: "We protect Nigerian businesses from regulatory risk." },
  { icon: Scale, title: "Accuracy", description: "Every recommendation is grounded in actual Nigerian law." },
  { icon: Globe, title: "Accessibility", description: "Compliance in English, Yoruba, Hausa, Igbo, and Pidgin." },
  { icon: Lock, title: "Security", description: "Data sovereignty in Nigeria with NDPA 2023 compliance." },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* HERO */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b-4 border-gold w-full">
        <div className="absolute inset-0 opacity-[0.15]">
          <Image src="/images/pages/about-hero.jpg" alt="" fill priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-navy/80 via-navy/60 to-navy/80" />
        <div className="container relative text-center px-4 w-full">
          <span className="badge badge-gold mb-4 md:mb-6 border border-gold/30">
            <Shield className="w-3 h-3 shrink-0" /> About Us
          </span>
          <h1 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">Building Nigeria&apos;s Compliance Future</h1>
          <p className="text-silver text-sm md:text-lg max-w-full md:max-w-2xl mx-auto">RegulaSphere is a product of Nexus SafeSphere Technologies Limited.</p>
        </div>
      </section>

      {/* MISSION */}
      <section className="section-padding bg-white w-full">
        <div className="container max-w-full md:max-w-3xl px-4 w-full mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="badge badge-outline mb-3 md:mb-4">Our Mission</span>
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl">Why We Exist</h2>
          </div>
          <div className="space-y-4 md:space-y-6">
            <p className="text-secondary text-base md:text-lg leading-relaxed text-center">Nigerian businesses are losing billions of Naira to avoidable regulatory fines. We believe compliance should not be a burden - it should be simple, accessible, and proactive.</p>
            <p className="text-secondary text-base md:text-lg leading-relaxed text-center">That is why we built an AI-powered compliance operating system that tells businesses exactly what to do, when, and how.</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-padding bg-off-white border-y border-border w-full">
        <div className="container px-4 w-full mx-auto">
          <div className="text-center max-w-full md:max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="badge badge-outline mb-3 md:mb-4">Our Values</span>
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 stagger-in w-full">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="card text-center bg-white border border-border hover:border-gold/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 mx-auto gold-gradient rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-md">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                  </div>
                  <h3 className="mb-2 text-sm md:text-base">{value.title}</h3>
                  <p className="text-xs md:text-sm text-secondary leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section-padding bg-white w-full">
        <div className="container px-4 w-full mx-auto">
          <div className="text-center max-w-full md:max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="badge badge-outline mb-3 md:mb-4">Our Team</span>
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl">Meet the People Behind RegulaSphere</h2>
            <p className="text-secondary text-sm md:text-base">A balanced team with expertise in business strategy, regulatory research, and AI engineering.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-full md:max-w-4xl mx-auto stagger-in w-full">
            {TEAM.map((member) => (
              <div key={member.name} className="card text-center bg-linear-to-b from-white to-off-white border border-border hover:border-gold/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full">
                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden border-4 border-gold/30 shadow-lg">
                  <Image src={member.image} alt={member.name} width={112} height={112} className="object-cover w-full h-full" />
                </div>
                <h3 className="text-sm md:text-base mb-1">{member.name}</h3>
                <p className="text-gold font-semibold text-xs md:text-sm mb-2 md:mb-3">{member.role}</p>
                <p className="text-xs md:text-sm text-secondary leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy section-padding border-t-4 border-gold w-full">
        <div className="container text-center px-4 w-full">
          <h2 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl">Ready to Stay Compliant?</h2>
          <p className="text-silver mb-6 md:mb-8 text-base md:text-lg">Join RegulaSphere and never worry about fines again.</p>
          <Link href="/register" className="btn btn-primary btn-lg inline-flex items-center gap-2 shadow-xl hover:shadow-2xl justify-center">
            Get Started Free <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </section>
    </div>
  );
}