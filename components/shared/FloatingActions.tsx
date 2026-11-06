"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, X, MessageCircle, ArrowUpRight } from "lucide-react";

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating buttons container */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/2348076217098?text=Hello%20RegulaSphere%2C%20I%20need%20help%20with%20compliance"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-11 items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold hidden sm:block">
            WhatsApp
          </span>
        </a>

        {/* AI Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex min-h-11 items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${
            isOpen
              ? "bg-navy text-white border border-gold/30"
              : "gold-gradient text-navy"
          }`}
          aria-label="Open AI Chat"
        >
          {isOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          ) : (
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold hidden sm:block">
            {isOpen ? "Close" : "AI Chat"}
          </span>
        </button>
      </div>

      {/* AI Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-96 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden fade-in-up">
          {/* Header */}
          <div className="bg-navy text-white p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gold-gradient rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-navy" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold truncate">
                  RegulaSphere AI
                </h3>
                <p className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-silver hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Chat body */}
          <div className="p-3 sm:p-4 bg-off-white max-h-60 sm:max-h-72 overflow-y-auto space-y-2 sm:space-y-3">
            <div className="bg-white rounded-lg p-3 border border-border">
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Hello! Ask me anything about Nigerian compliance, deadlines, or
                penalties.
              </p>
            </div>

            {/* Quick questions */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                "What's due this month?",
                "Check my NDPC status",
                "AI governance requirements",
              ].map((question) => (
                <button
                  key={question}
                  className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border bg-white hover:border-gold hover:text-gold transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 bg-white border-t border-border flex gap-2">
            <Link
              href="/dashboard/chat"
              className="btn btn-primary flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Bot className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> Open Full Chat
            </Link>
            <Link
              href="/dashboard/chat"
              className="btn btn-secondary flex items-center justify-center w-10 sm:w-12"
              aria-label="Open in new tab"
              onClick={() => setIsOpen(false)}
            >
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}