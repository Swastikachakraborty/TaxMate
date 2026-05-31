import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: "user", text: "What is my advance tax liability for Q1?" },
  {
    id: 2,
    role: "ai",
    text: "Based on your income so far, your Q1 advance tax (due June 15) is ₹21,125 — which is 25% of your estimated annual tax of ₹84,500. Since you've already paid ₹42,000, you may be ahead of schedule. I'd recommend paying ₹21,125 by June 15, 2025 to stay compliant.",
  },
  { id: 3, role: "user", text: "Can I claim my laptop as a business deduction?" },
  {
    id: 4,
    role: "ai",
    text: "Yes! Under Section 44ADA (Presumptive Taxation for professionals), 50% of your gross receipts is deemed as expenses — this covers your laptop, internet, and all other business expenses. You don't need to maintain separate records or receipts for individual items. Your deduction is already calculated as ₹4,20,000 (50% of ₹8,40,000).",
  },
];

const SUGGESTIONS = [
  "What's my advance tax due?",
  "Can I claim laptop as deduction?",
  "When is my next ITR deadline?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#8c8577]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: text.trim() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Great question! Based on your financial profile for FY 2024–25, your total income is ₹8,40,000 across Upwork, Swiggy, and bank interest. Under Section 44ADA, you're eligible for a 50% flat deduction, making your net taxable income ₹4,20,000. Would you like me to break down any specific aspect?",
        },
      ]);
    }, 1800);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 md:px-10 pt-8 pb-4 border-b border-[#e8e2d5] shrink-0">
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-1">Chat Assistant</h1>
        <p className="text-[#6b675d] text-sm">Ask anything about your taxes, deductions, or ITR filing</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
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
              <div
                data-testid={`message-${msg.id}`}
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#d97706] text-white rounded-br-sm"
                    : "bg-[#fdfbf7] border border-[#e8e2d5] border-l-2 border-l-[#d97706] text-[#1a1a2e] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-3 justify-start"
          >
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
            <button
              key={s}
              onClick={() => sendMessage(s)}
              data-testid={`suggestion-${s.slice(0, 15).replace(/\s/g, "-").toLowerCase()}`}
              className="text-xs px-3 py-1.5 rounded-full border border-[#e8e2d5] text-[#6b675d] hover:text-[#1a1a2e] hover:border-[#d97706]/40 hover:bg-[#f4ebd9]/30 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-[#fdfbf7] border border-[#e8e2d5] rounded-full px-4 py-2 focus-within:border-[#d97706]/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your taxes..."
            data-testid="chat-input"
            className="flex-1 bg-transparent text-[#1a1a2e] text-sm placeholder:text-[#8c8577] outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            data-testid="send-button"
            className="w-8 h-8 rounded-full bg-[#d97706] hover:bg-[#b46204] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
