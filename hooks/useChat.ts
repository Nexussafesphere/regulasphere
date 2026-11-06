"use client";

import { useState, useCallback} from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
}

let messageCounter = 0;

function generateId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export function useChat(
  businessId?: string,
  businessContext?: Record<string, string | number | boolean>,
  language: string = "English"
) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello. I am your RegulaSphere AI compliance assistant. Ask me anything about Nigerian regulations.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            language,
            businessId,
            businessContext,
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
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to send message";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [businessId, businessContext, language, isLoading]
  );

  return { messages, isLoading, error, sendMessage };
}