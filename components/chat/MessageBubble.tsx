import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          role === "user"
            ? "bg-gold text-navy"
            : "bg-off-white text-navy border border-border"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {role === "user" ? (
            <User className="w-3 h-3" />
          ) : (
            <Bot className="w-3 h-3" />
          )}
          <span className="text-xs font-semibold">
            {role === "user" ? "You" : "RegulaSphere AI"}
          </span>
          {timestamp && (
            <span className="text-xs text-muted ml-auto">{timestamp}</span>
          )}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}