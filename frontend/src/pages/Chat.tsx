import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, AlertCircle, Zap, RefreshCw, WifiOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  tools?: string[];
}

const SUGGESTIONS = [
  { en: "What's my total tax liability?", hi: "मेरा कुल टैक्स?" },
  { en: "Explain Section 44ADA", hi: "44ADA क्या है?" },
  { en: "When is my advance tax due?", hi: "Advance tax कब देना है?" },
  { en: "Can I reduce my tax further?", hi: "टैक्स कम कैसे करें?" },
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
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#d97706]"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

const WELCOME: Message = {
  id: 0,
  role: "ai",
  text: "Namaste! 🙏 मैं आपका GigSaathi AI Tax Advisor हूँ।\n\nमैं आपकी help कर सकता हूँ:\n- **Tax liability** calculate करने में\n- **Section 44ADA** समझाने में\n- **Advance tax deadlines** याद दिलाने में\n- **ITR-4** filing के लिए guide करने में\n\nकोई भी सवाल पूछें — Hindi या English में!",
};

export default function Chat() {
  const { userId } = useAuth();
  const uid = userId ?? "demo_user";

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    setError("");
    setIsOffline(false);
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
      const msg = e.message ?? "";
      const isNet = msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("fetch");
      if (isNet) {
        setIsOffline(true);
        setError("Backend server से connect नहीं हो पाए। कृपया server चालू करें (port 8000)।");
      } else {
        setError(msg || "कुछ गलत हुआ। फिर से कोशिश करें।");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: isNet
            ? "⚠️ Backend server से connection नहीं हो पाई। कृपया GigSaathi backend को port 8000 पर चालू करें।\n\nRunning करने के लिए:\n```\ncd gigsaathi-backend\npython main.py\n```"
            : "Sorry, मैं अभी आपकी help नहीं कर पा रहा। फिर से कोशिश करें।",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      {/* Header */}
      <div className="px-6 md:px-10 pt-7 pb-4 border-b border-[#e8e2d5] shrink-0 bg-[#fdfbf7]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#d97706] uppercase tracking-wider mb-1">AI Sahayak · AI सहायक</p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#1a1a2e]">
              AI Tax Assistant
            </h1>
            <p className="text-[#6b675d] text-sm mt-1">
              Powered by Gemini · Hindi &amp; English में पूछें
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOffline ? (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Gemini Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          {isOffline && (
            <button
              onClick={() => { setError(""); setIsOffline(false); }}
              className="shrink-0 flex items-center gap-1 text-red-500 hover:text-red-700 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center shrink-0 mb-0.5">
                  <Bot className="w-4 h-4 text-[#d97706]" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[78%]">
                {msg.tools && msg.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {msg.tools.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#f4ebd9] text-[#b46204] font-medium border border-[#d97706]/20"
                      >
                        <Zap className="w-2.5 h-2.5" />{t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-[#1a1a2e] text-white rounded-br-sm"
                      : "bg-[#fdfbf7] border border-[#e8e2d5] border-l-2 border-l-[#d97706] text-[#1a1a2e] rounded-bl-sm shadow-sm"
                  }`}
                >
                  <RichText text={msg.text} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#d97706]" />
            </div>
            <div className="bg-[#fdfbf7] border border-[#e8e2d5] border-l-2 border-l-[#d97706] rounded-2xl rounded-bl-sm shadow-sm">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions + Input */}
      <div className="px-4 md:px-8 pb-4 md:pb-6 pt-2 shrink-0 space-y-3 border-t border-[#e8e2d5] bg-[#fdfbf7]">
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.en}
              onClick={() => sendMessage(s.en)}
              disabled={isTyping}
              className="group text-xs px-3 py-1.5 rounded-full border border-[#e8e2d5] text-[#6b675d] hover:text-[#1a1a2e] hover:border-[#d97706]/40 hover:bg-[#f4ebd9]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="block group-hover:hidden">{s.hi}</span>
              <span className="hidden group-hover:block">{s.en}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#e8e2d5] rounded-full px-4 py-2.5 focus-within:border-[#d97706]/50 focus-within:ring-1 focus-within:ring-[#d97706]/20 transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="कोई भी सवाल पूछें — Hindi या English में..."
            className="flex-1 bg-transparent text-[#1a1a2e] text-sm placeholder:text-[#8c8577] outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full bg-[#d97706] hover:bg-[#b46204] flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-[#c4b99d] text-center">
          GigSaathi AI · Section 44ADA expert · Powered by Gemini
        </p>
      </div>
    </div>
  );
}
