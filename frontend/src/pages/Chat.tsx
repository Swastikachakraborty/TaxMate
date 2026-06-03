import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  tools?: string[];
}

const SUGGESTIONS = [
  "What's my total tax liability?",
  "Explain Section 44ADA in simple words",
  "When is my advance tax due?",
  "Can I reduce my tax further?",
];

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const parts: React.ReactNode[] = [];
        const boldRe = /\*\*(.*?)\*\*/g;
        let last = 0, m: RegExpExecArray | null;
        while ((m = boldRe.exec(line)) !== null) {
          if (m.index > last) parts.push(line.slice(last, m.index));
          parts.push(<strong key={m.index} className="font-bold text-inherit">{m[1]}</strong>);
          last = m.index + m[0].length;
        }
        if (last < line.length) parts.push(line.slice(last));
        return <p key={i} className="leading-relaxed">{parts.length > 0 ? parts : line}</p>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-[#8c8577]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

const WELCOME: Message = {
  id: 0,
  role: "ai",
  text: "Namaste! 🙏 I'm your GigSaathi AI assistant.\n\nI can help you understand your tax situation, explain deductions, calculate advance tax, and answer any questions about filing your ITR-4.\n\nWhat would you like to know?",
};

export default function Chat() {
  const { userId } = useAuth();
  const uid = userId ?? "demo_user";

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setError("");
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const result = await api.chat(uid, text.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: result.response,
          tools: result.tools_called,
        },
      ]);
    } catch (e: any) {
      setError(e.message ?? "Could not reach the AI. Is the backend running?");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Sorry, I couldn't reach the backend right now. Please make sure the GigSaathi backend is running on port 8000.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 md:px-10 pt-8 pb-4 border-b border-[#e8e2d5] shrink-0">
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-1">
          AI Tax Assistant
        </h1>
        <p className="text-[#6b675d] text-sm">
          Powered by Gemini · Ask anything about your taxes, deductions, or ITR-4 filing
        </p>
      </div>

      {error && (
        <div className="mx-6 mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center shrink-0 mb-0.5">
                  <Bot className="w-4 h-4 text-[#d97706]" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[75%]">
                {msg.tools && msg.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {msg.tools.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#f4ebd9] text-[#b46204] font-medium border border-[#d97706]/20">
                        <Zap className="w-2.5 h-2.5" />{t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-[#d97706] text-white rounded-br-sm"
                    : "bg-[#fdfbf7] border border-[#e8e2d5] border-l-2 border-l-[#d97706] text-[#1a1a2e] rounded-bl-sm"
                }`}>
                  <RichText text={msg.text} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#d97706]" />
            </div>
            <div className="bg-[#fdfbf7] border border-[#e8e2d5] border-l-2 border-l-[#d97706] rounded-2xl rounded-bl-sm">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 md:px-8 pb-6 md:pb-8 pt-2 shrink-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-[#e8e2d5] text-[#6b675d] hover:text-[#1a1a2e] hover:border-[#d97706]/40 hover:bg-[#f4ebd9]/30 transition-colors">
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-[#fdfbf7] border border-[#e8e2d5] rounded-full px-4 py-2 focus-within:border-[#d97706]/50 transition-colors">
          <input type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your taxes in Hindi or English..."
            className="flex-1 bg-transparent text-[#1a1a2e] text-sm placeholder:text-[#8c8577] outline-none" />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full bg-[#d97706] hover:bg-[#b46204] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
