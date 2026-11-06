"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Volume2,
  Square,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
}

const QUICK_ACTIONS = [
  "What do I need to file this month?",
  "What happens if I miss the NDPC audit deadline?",
  "Do I need to pay ITF levy?",
  "Check my AI governance compliance",
  "What documents are pending?",
  "Generate my compliance report",
];

const LANGUAGES = ["English", "Yoruba", "Hausa", "Igbo", "Pidgin"];

let messageCounter = 0;

function generateId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello. I am your RegulaSphere AI compliance assistant. Ask me anything about Nigerian regulations, deadlines, penalties, or what you need to do to stay compliant.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language,
          businessContext: {
            business_name: "Lagos Fintech Solutions",
            sector: "Fintech",
            employee_count: 50,
            data_processing: true,
            uses_ai: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.response,
        language,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again. If the problem persists, check your API configuration.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakMessage = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        lang === "Yoruba"
          ? "yo-NG"
          : lang === "Hausa"
          ? "ha-NG"
          : lang === "Igbo"
          ? "ig-NG"
          : "en-NG";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col w-full max-w-full overflow-x-hidden">
      <div className="container py-4 md:py-6 flex-1 flex flex-col px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 w-full">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 shrink-0" /> Back to Dashboard
            </Link>
            <h1 className="text-lg md:text-xl font-bold text-navy mt-1 truncate">
              AI Compliance Assistant
            </h1>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select w-full sm:w-36 shrink-0"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="card flex-1 flex flex-col max-h-[50vh] md:max-h-[55vh] w-full">
          <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-4 w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 md:px-4 md:py-3 ${
                    message.role === "user"
                      ? "bg-gold text-navy"
                      : "bg-off-white text-navy border border-border"
                  }`}
                >
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                    {message.role === "user" ? (
                      <User className="w-3 h-3 shrink-0" />
                    ) : (
                      <Bot className="w-3 h-3 shrink-0" />
                    )}
                    <span className="text-[10px] md:text-xs font-semibold">
                      {message.role === "user" ? "You" : "RegulaSphere AI"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </p>
                  {message.role === "assistant" && message.id !== "welcome" && (
                    <button
                      onClick={() =>
                        isSpeaking
                          ? stopSpeaking()
                          : speakMessage(message.content, message.language || "English")
                      }
                      className="text-[10px] md:text-xs text-gold mt-2 flex items-center gap-1 hover:underline"
                    >
                      {isSpeaking ? (
                        <>
                          <Square className="w-3 h-3 shrink-0" /> Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 shrink-0" /> Listen
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-off-white border border-border rounded-lg px-3 py-2 md:px-4 md:py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-gold animate-spin shrink-0" />
                  <span className="text-xs md:text-sm text-muted">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="flex gap-1.5 md:gap-2 mt-3 flex-wrap w-full">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              disabled={isLoading}
              className="btn btn-secondary btn-sm text-[10px] md:text-xs"
            >
              {action}
            </button>
          ))}
        </div>

        <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            placeholder="Ask about compliance requirements..."
            className="input flex-1 min-w-0 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="btn btn-primary flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}