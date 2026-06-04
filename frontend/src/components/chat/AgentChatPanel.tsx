import { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Paperclip, Zap, AlertCircle, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAgentChat, Msg } from "@/hooks/useAgentChat";
import { api } from "@/lib/api";

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function Dots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#d97706] inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

const SUGGESTIONS = [
  "What is my total tax liability?",
  "How can I reduce my tax this year?",
  "When is my next advance tax deadline?",
  "Explain Section 44ADA in simple words",
];

interface AgentChatPanelProps {
  uid: string;
  profileReady: boolean;
  showOnboarding: boolean;
  userLoading: boolean;
  userName?: string | null;
}

export function AgentChatPanel({ uid, profileReady, showOnboarding, userLoading, userName }: AgentChatPanelProps) {
  const queryClient = useQueryClient();
  const {
    messages,
    setMessages,
    input,
    setInput,
    streaming,
    setStreaming,
    chatError,
    setChatError,
    sendMessage,
    abortStream
  } = useAgentChat(uid, profileReady, showOnboarding);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Welcome message once profile loads
  useEffect(() => {
    if (messages.length === 0 && !userLoading) {
      setMessages([{
        id: 0,
        role: "ai",
        text: `Namaste${userName ? ` ${userName}` : ""}! 🙏\n\nI am your **GigSaathi AI Tax Advisor**, powered by Gemini.\n\nI can:\n- Calculate your exact Section 44ADA tax liability\n- Parse your Swiggy / Uber / Upwork payout PDFs\n- Tell you upcoming advance tax deadlines\n- Generate your ITR-4 computation worksheet\n\nAsk me anything, or **attach a payout statement PDF** using the 📎 button below.`,
      }]);
    }
  }, [userLoading, userName, setMessages, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // File Upload via Chat
  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setChatError("Only PDF files are supported.");
      return;
    }

    setChatError("");
    const userMsg: Msg = { id: Date.now(), role: "user", text: `📎 Uploading: **${file.name}**` };
    const aiId = Date.now() + 1;
    setMessages(prev => [...prev, userMsg, { id: aiId, role: "ai", text: "", streaming: true }]);
    setStreaming(true);

    try {
      const result = await api.uploadPdfs(uid || "demo_user", [file]);
      const r = result.file_results?.[0];
      let reply = `📄 **Parsed ${file.name}** using Multimodal AI.\n\n`;
      if (r?.status === "success") {
        reply += `- Platform detected: **${r.platform_detected?.toUpperCase()}**\n- Transactions extracted: **${r.records_stored}**\n- Gross income: **${INR(r.total_gross_income)}**\n\nYour Tax Registry on the right has been updated!`;
      } else {
        reply += r?.error ?? "Could not parse the file.";
      }
      if (result.duplicate_detection?.duplicates_flagged > 0) {
        reply += `\n\n⚠️ ${result.duplicate_detection.duplicates_flagged} duplicate transactions were excluded.`;
      }
      setMessages(prev => prev.map(m =>
        m.id === aiId ? { ...m, text: reply, streaming: false } : m
      ));
      queryClient.invalidateQueries({ queryKey: ["income", uid] });
      queryClient.invalidateQueries({ queryKey: ["tax", uid] });
      queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
    } catch (err: any) {
      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, text: `Upload failed: ${err.message}`, streaming: false }
          : m
      ));
    } finally {
      setStreaming(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [uid, queryClient, setChatError, setMessages, setStreaming]);


  return (
    <div className="flex flex-col w-full lg:w-[52%] xl:w-[48%] border-r border-[#e8e2d5] bg-[#fdfbf7] shrink-0 overflow-hidden">
      
      {/* Pane header */}
      <div className="px-4 py-2.5 border-b border-[#e8e2d5] bg-[#fdfbf7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#f4ebd9] flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-[#d97706]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1a1a2e]">GigSaathi Copilot</p>
            <p className="text-[9px] text-[#8c8577]">Gemini · Function Calling · Real Data</p>
          </div>
        </div>
        {streaming && (
          <button onClick={abortStream}
            className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-700 border border-red-200 bg-red-50 px-2 py-1 rounded-full transition-colors">
            <X className="w-3 h-3" /> Stop
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center shrink-0 mb-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#d97706]" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[82%]">
                {/* Tool badges */}
                {msg.tools && msg.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.tools.map(t => (
                      <span key={t} className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Zap className="w-2.5 h-2.5" />{t.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
                {/* Bubble */}
                <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] ${
                  msg.role === "user"
                    ? "bg-[#1a1a2e] text-white rounded-br-sm"
                    : "bg-white border border-[#e8e2d5] border-l-2 border-l-[#d97706] text-[#1a1a2e] rounded-bl-sm shadow-sm markdown-body"
                }`}>
                  {msg.streaming && !msg.text
                    ? <Dots />
                    : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )
                  }
                  {msg.streaming && msg.text && (
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-3.5 bg-[#d97706] ml-0.5 align-middle" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {chatError && (
        <div className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-[11px] text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1">{chatError}</span>
          <button onClick={() => setChatError("")}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Suggestions */}
      <div className="px-4 pt-2 flex flex-wrap gap-1.5 shrink-0">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)} disabled={streaming || !profileReady}
            className="text-[10px] px-2.5 py-1 rounded-full border border-[#e8e2d5] text-[#6b675d] hover:text-[#1a1a2e] hover:border-[#d97706]/40 hover:bg-[#f4ebd9]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-[#e8e2d5] rounded-xl px-3 py-2 focus-within:border-[#d97706]/60 focus-within:ring-1 focus-within:ring-[#d97706]/20 transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Ask about your taxes, deadlines, deductions…"
            className="flex-1 bg-transparent text-[#1a1a2e] text-sm placeholder:text-[#c4b99d] outline-none"
          />
          <input type="file" ref={fileRef} onChange={handleFile} accept=".pdf" className="hidden" />
          <button onClick={() => fileRef.current?.click()} title="Upload PDF statement"
            disabled={!uid || streaming}
            className="p-1.5 rounded-lg text-[#8c8577] hover:text-[#d97706] hover:bg-[#f4ebd9]/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Paperclip className="w-4 h-4" />
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || streaming || !profileReady}
            className="w-8 h-8 rounded-lg bg-[#d97706] hover:bg-[#b46204] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[9px] text-[#c4b99d] text-center mt-1.5">
          {profileReady
            ? "Attach payout PDFs (Swiggy, Uber, Upwork) · Agent calls real backend tools"
            : showOnboarding
            ? "⚠️ Complete your profile setup above to unlock chat"
            : userLoading
            ? "Loading your profile…"
            : "Attach a PDF to get started — or complete your profile first"}
        </p>
      </div>
    </div>
  );
}
