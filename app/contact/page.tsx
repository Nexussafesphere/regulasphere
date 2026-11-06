"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Failed to send message");
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* HERO */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b-4 border-gold w-full">
        <div className="absolute inset-0 opacity-[0.15]">
          <Image
            src="/images/pages/contact-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-navy/80 via-navy/60 to-navy/80" />
        <div className="container relative text-center px-4 w-full">
          <span className="badge badge-gold mb-4 md:mb-6 border border-gold/30">
            <Shield className="w-3 h-3 shrink-0" /> Contact
          </span>
          <h1 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Get in Touch
          </h1>
          <p className="text-silver text-sm md:text-lg max-w-full md:max-w-xl mx-auto">
            Have questions about RegulaSphere? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section-padding bg-off-white w-full">
        <div className="container max-w-full md:max-w-4xl px-4 w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12 w-full">
            <div className="card text-center bg-white border border-border hover:border-gold/50 hover:shadow-lg transition-all w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto gold-gradient rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-navy" />
              </div>
              <h3 className="mb-1 text-sm md:text-base">Email</h3>
              <p className="text-xs md:text-sm text-secondary break-all">
                nexusafesphere@outlook.com
              </p>
            </div>

            <div className="card text-center bg-white border border-border hover:border-gold/50 hover:shadow-lg transition-all w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto gold-gradient rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-navy" />
              </div>
              <h3 className="mb-1 text-sm md:text-base">Phone</h3>
              <p className="text-xs md:text-sm text-secondary">+234 807 621 7098</p>
            </div>

            <div className="card text-center bg-white border border-border hover:border-gold/50 hover:shadow-lg transition-all w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto gold-gradient rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-navy" />
              </div>
              <h3 className="mb-1 text-sm md:text-base">Office</h3>
              <p className="text-xs md:text-sm text-secondary">Abuja, Nigeria</p>
            </div>
          </div>

          <div className="card bg-white border border-border shadow-xl w-full p-5 sm:p-6 md:p-8">
            {sent ? (
              <div className="text-center py-8 md:py-12 fade-in-up">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-3 md:mb-4" />
                <h3 className="mb-2 text-lg md:text-xl">Message Sent!</h3>
                <p className="text-xs md:text-sm text-secondary">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn btn-secondary btn-sm mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 w-full">
                {error && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <label className="sr-only" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
                  <div>
                    <label htmlFor="name" className="label text-xs sm:text-sm">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input w-full"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label text-xs sm:text-sm">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="label text-xs sm:text-sm">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input w-full"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="label text-xs sm:text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input w-full"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" /> Send Message
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 shrink-0" /> Response within 24 hours
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 shrink-0" /> Your data is safe
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}