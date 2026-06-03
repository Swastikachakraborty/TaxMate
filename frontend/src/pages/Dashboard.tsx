import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Paperclip, Zap, AlertCircle, X,
  TrendingUp, Calendar, FileText, UploadCloud,
  Loader2, Sparkles, ChevronRight, RefreshCw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type IncomeSummary, type TaxResult, type DeadlinesResult, type UserProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

// ── Helpers ──────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATES_OF_INDIA = [
  "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Haryana", "Kerala", "Other",
];
const OCCUPATIONS = [
  { value: "freelancer", label: "Freelancer / Professional (Sec 44ADA)" },
  { value: "delivery", label: "Delivery Partner (Swiggy, Zomato, etc.)" },
  { value: "rideshare", label: "Rideshare Driver (Uber, Ola, etc.)" },
  { value: "mixed", label: "Mixed / Multiple Platform Roles" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
  tools?: string[];
  streaming?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1 leading-relaxed">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        const parts: React.ReactNode[] = [];
        const re = /\*\*(.*?)\*\*/g;
        let last = 0, m: RegExpExecArray | null;
        while ((m = re.exec(line)) !== null) {
          if (m.index > last) parts.push(line.slice(last, m.index));
          parts.push(<strong key={m.index} className="font-semibold text-inherit">{m[1]}</strong>);
          last = m.index + m[0].length;
        }
        if (last < line.length) parts.push(line.slice(last));
        return <p key={i}>{parts.length ? parts : line}</p>;
      })}
    </div>
  );
}

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

function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string; value: string; sub?: string; accent?: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#f4ebd9] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#8c8577] uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-lg font-bold leading-none ${accent ?? "text-[#1a1a2e]"}`}>{value}</p>
        {sub && <p className="text-[10px] text-[#8c8577] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyPanel({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-[#f4ebd9] flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{title}</p>
        <p className="text-xs text-[#8c8577] max-w-[200px] mt-1">{desc}</p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { userId, name, isLoaded } = useAuth();
  const uid = userId ?? "";
  const queryClient = useQueryClient();

  // ── Onboarding ──
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardName, setOnboardName] = useState(name ?? "");
  const [onboardAge, setOnboardAge] = useState("25");
  const [onboardState, setOnboardState] = useState("Maharashtra");
  const [onboardOcc, setOnboardOcc] = useState("freelancer");
  const [onboardPan, setOnboardPan] = useState("");
  const [onboardSubmitting, setOnboardSubmitting] = useState(false);
  const [onboardError, setOnboardError] = useState("");

  useEffect(() => { if (name && !onboardName) setOnboardName(name); }, [name]);

  // ── Data Fetching ──
  const userQ = useQuery<UserProfile>({
    queryKey: ["userProfile", uid],
    queryFn: () => api.getUser(uid),
    enabled: !!uid,
    retry: false,
  });

  const isNewUser = !!uid && userQ.isError &&
    ((userQ.error as any)?.message?.toLowerCase().includes("not found") ||
      (userQ.error as any)?.status === 404);

  // Chat is only allowed once we have a confirmed profile in MongoDB
  const profileReady = !!uid && !!userQ.data && !isNewUser;

  // Open onboarding dialog exactly once when we detect a 404 (new user).
  // State is independent of query re-renders so the dialog stays stable.
  useEffect(() => {
    if (isNewUser && !userQ.isLoading) {
      setShowOnboarding(true);
    }
  }, [isNewUser, userQ.isLoading]);


  const incomeQ = useQuery<IncomeSummary>({
    queryKey: ["income", uid],
    queryFn: () => api.getIncome(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  const taxQ = useQuery<TaxResult>({
    queryKey: ["tax", uid],
    queryFn: () => api.getTax(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  const deadlinesQ = useQuery<DeadlinesResult>({
    queryKey: ["deadlines", uid],
    queryFn: () => api.getDeadlines(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  // ── Chat state ──
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [chatError, setChatError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Welcome message once profile loads
  useEffect(() => {
    if (messages.length === 0 && !userQ.isLoading) {
      const userName = userQ.data?.name ?? name ?? null;
      setMessages([{
        id: 0,
        role: "ai",
        text: `Namaste${userName ? ` ${userName}` : ""}! 🙏\n\nI am your **GigSaathi AI Tax Advisor**, powered by Gemini.\n\nI can:\n- Calculate your exact Section 44ADA tax liability\n- Parse your Swiggy / Uber / Upwork payout PDFs\n- Tell you upcoming advance tax deadlines\n- Generate your ITR-4 computation worksheet\n\nAsk me anything, or **attach a payout statement PDF** using the 📎 button below.`,
      }]);
    }
  }, [userQ.isLoading, userQ.data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // ── Streaming Chat via SSE ──
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    setChatError("");

    // Block chat until profile is confirmed in MongoDB
    if (!profileReady) {
      if (showOnboarding) {
        setChatError("Please complete your profile setup first — fill in the form above.");
      } else {
        setChatError("Profile is still loading, please wait a moment…");
      }
      return;
    }

    const userMsg: Msg = { id: Date.now(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    // Create placeholder AI message
    const aiId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiId, role: "ai", text: "", streaming: true }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid, message: text.trim() }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Failed to reach AI");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let toolsCalled: string[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "content") {
              fullText += event.content;
              setMessages(prev =>
                prev.map(m => m.id === aiId ? { ...m, text: fullText, streaming: true } : m)
              );
            } else if (event.type === "tool_call") {
              toolsCalled = [...toolsCalled, event.content];
              setMessages(prev =>
                prev.map(m => m.id === aiId ? { ...m, tools: toolsCalled } : m)
              );
              // Refresh panels when tools are called
              queryClient.invalidateQueries({ queryKey: ["income", uid] });
              queryClient.invalidateQueries({ queryKey: ["tax", uid] });
              queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
            } else if (event.type === "done") {
              setMessages(prev =>
                prev.map(m => m.id === aiId
                  ? { ...m, text: fullText || "Done.", streaming: false, tools: event.tools_called }
                  : m)
              );
            } else if (event.type === "error") {
              throw new Error(event.content);
            }
          } catch { /* ignore parse errors on non-json lines */ }
        }
      }

      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, streaming: false } : m)
      );
    } catch (e: any) {
      if (e.name === "AbortError") return;
      const msg = e.message ?? "";
      const isNetworkError = msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("fetch");
      const is404 = msg.toLowerCase().includes("not found");
      const friendlyError = is404
        ? "Profile not found — please complete your onboarding profile first."
        : isNetworkError
        ? "Cannot reach the backend server. Is it running on port 8000?"
        : msg || "Could not reach the AI agent";
      setChatError(friendlyError);
      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, text: is404
              ? "It looks like your profile hasn't been set up yet. Please fill in the onboarding form to get started!"
              : "I could not connect to the backend server. Please make sure it is running on port 8000.",
            streaming: false }
          : m
      ));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, uid, isNewUser, queryClient]);

  // ── File Upload via Chat ──
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
  }, [uid, queryClient]);

  // ── Onboarding Submit ──
  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) { setOnboardError("Name is required"); return; }
    const age = parseInt(onboardAge);
    if (isNaN(age) || age < 18 || age > 120) { setOnboardError("Enter a valid age (18–120)"); return; }
    setOnboardSubmitting(true);
    setOnboardError("");
    try {
      await api.createUser({
        user_id: uid,
        name: onboardName.trim(),
        state: onboardState,
        occupation_type: onboardOcc,
        age,
        opted_44ADA: true,
        pan_number: onboardPan.trim().toUpperCase() || undefined,
      });
      // Profile created — close dialog and refresh all data
      setShowOnboarding(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile", uid] });
      queryClient.invalidateQueries({ queryKey: ["income", uid] });
      queryClient.invalidateQueries({ queryKey: ["tax", uid] });
      queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
    } catch (err: any) {
      // If user already exists (409) just close the dialog
      if ((err.message ?? "").toLowerCase().includes("already exists")) {
        setShowOnboarding(false);
        queryClient.invalidateQueries({ queryKey: ["userProfile", uid] });
      } else {
        setOnboardError(err.message ?? "Something went wrong.");
      }
    } finally {
      setOnboardSubmitting(false);
    }
  };

  // ── Derived data ──
  const income = incomeQ.data;
  const tax = taxQ.data;
  const deadlines = deadlinesQ.data;
  const hasIncome = (income?.record_count ?? 0) > 0;
  const nextDeadline = deadlines?.next_deadline;

  const SUGGESTIONS = [
    "What is my total tax liability?",
    "How can I reduce my tax this year?",
    "When is my next advance tax deadline?",
    "Explain Section 44ADA in simple words",
  ];

  // Don't render until Clerk and user profile are resolved
  if (!isLoaded || (!!userId && userQ.isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8c8577]">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#faf7f2]">

      {/* ── Onboarding Dialog ── */}
      <Dialog open={showOnboarding}>
        <DialogContent className="sm:max-w-md bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl shadow-2xl outline-none">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d97706] animate-pulse" />
              Welcome to GigSaathi
            </DialogTitle>
            <DialogDescription className="text-[#6b675d] text-sm">
              Set up your profile once — GigSaathi will tailor every calculation to you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboard} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Your Name</label>
              <input value={onboardName} onChange={e => setOnboardName(e.target.value)}
                placeholder="Priya Sharma" required
                className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">State</label>
                <select value={onboardState} onChange={e => setOnboardState(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]">
                  {STATES_OF_INDIA.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Age</label>
                <input type="number" value={onboardAge} onChange={e => setOnboardAge(e.target.value)}
                  min="18" max="120" required
                  className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Primary Occupation</label>
              <select value={onboardOcc} onChange={e => setOnboardOcc(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]">
                {OCCUPATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">PAN Number <span className="text-[#8c8577] normal-case font-normal">(optional)</span></label>
              <input value={onboardPan} onChange={e => setOnboardPan(e.target.value)}
                placeholder="ABCDE1234F" maxLength={10}
                className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm uppercase placeholder:normal-case placeholder:text-[#c4b99d] focus:outline-none focus:border-[#d97706]" />
            </div>
            {onboardError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{onboardError}
              </p>
            )}
            <DialogFooter className="pt-1">
              <button type="submit" disabled={onboardSubmitting}
                className="w-full h-11 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm">
                {onboardSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up…</>
                  : <>Create Profile &amp; Enter Workspace <ChevronRight className="w-4 h-4" /></>}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-5 md:px-8 h-14 border-b border-[#e8e2d5] shrink-0 bg-[#fdfbf7]/80 backdrop-blur-sm">
        <div>
          <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-widest">FY 2025–26 · Agent Workspace</span>
          <h1 className="font-['Playfair_Display'] text-lg font-semibold text-[#1a1a2e] leading-none">
            {userQ.data?.name ?? name ?? "GigSaathi"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["income", uid] });
              queryClient.invalidateQueries({ queryKey: ["tax", uid] });
              queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
            }}
            className="w-8 h-8 rounded-lg border border-[#e8e2d5] flex items-center justify-center text-[#8c8577] hover:text-[#d97706] hover:border-[#d97706]/40 transition-all"
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Gemini Agent Active
          </span>
        </div>
      </header>

      {/* ── Main split layout ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ════════════════════════════════════════════════
            LEFT PANE — AI Agent Chat
        ════════════════════════════════════════════════ */}
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
              <button onClick={() => abortRef.current?.abort()}
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
                        : "bg-white border border-[#e8e2d5] border-l-2 border-l-[#d97706] text-[#1a1a2e] rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.streaming && !msg.text
                        ? <Dots />
                        : <RichText text={msg.text} />}
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
              {/* Upload works independently of profile — the backend accepts it per-user */}
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
                : userQ.isLoading
                ? "Loading your profile…"
                : "Attach a PDF to get started — or complete your profile first"}
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT PANE — Live Financial Dashboard
        ════════════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-col flex-1 overflow-y-auto bg-[#faf7f2] p-5 space-y-5">

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Gross Earnings"
              value={hasIncome ? INR(income!.total_gross_income) : "—"}
              sub={hasIncome ? `${income!.record_count} transactions · ${Object.keys(income!.platform_breakdown).length} platforms` : "No data yet"}
              icon={<TrendingUp className="w-4 h-4 text-[#d97706]" />}
            />
            <StatCard
              label="Tax Liability (44ADA)"
              value={tax ? INR(tax.total_tax) : "—"}
              sub={tax ? `Net payable: ${INR(tax.net_payable)}` : "No data yet"}
              accent={tax && tax.net_payable > 0 ? "text-red-600" : undefined}
              icon={<FileText className="w-4 h-4 text-[#d97706]" />}
            />
          </div>

          {/* Next Deadline */}
          <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d97706]" />
                <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Next Advance Tax Deadline</span>
              </div>
              {deadlinesQ.isLoading && <Loader2 className="w-3.5 h-3.5 text-[#8c8577] animate-spin" />}
            </div>
            {nextDeadline ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-[#1a1a2e]">{nextDeadline.installment}</p>
                  <p className="text-xs text-[#8c8577]">Due: {new Date(nextDeadline.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#d97706]">{INR(nextDeadline.amount_due)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    nextDeadline.alert_level === "urgent"
                      ? "bg-red-100 text-red-600"
                      : nextDeadline.alert_level === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {nextDeadline.days_remaining != null
                      ? nextDeadline.days_remaining > 0
                        ? `${nextDeadline.days_remaining} days left`
                        : "Overdue"
                      : nextDeadline.status}
                  </span>
                </div>
              </div>
            ) : (
              <EmptyPanel
                icon={<Calendar className="w-5 h-5 text-[#d97706]" />}
                title="No deadline data"
                desc="Upload your payout PDFs and the agent will calculate your advance tax schedule"
              />
            )}
          </div>

          {/* Tax Breakdown */}
          <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#d97706]" />
              <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Tax Computation (Sec 44ADA)</span>
            </div>
            {tax ? (
              <div className="space-y-2 text-xs">
                {[
                  { label: "Gross Receipts", val: INR(tax.gross_income), color: "text-[#1a1a2e] font-semibold" },
                  { label: "Presumptive Deduction (50%)", val: `−${INR(tax.deduction_44ada)}`, color: "text-[#b45309]" },
                  { label: "Net Taxable Income", val: INR(tax.net_taxable_income), color: "text-[#1a1a2e] font-bold" },
                  { label: "Calculated Tax + Cess", val: INR(tax.total_tax), color: "text-[#1a1a2e]" },
                  { label: "TDS Already Deducted", val: `−${INR(tax.tds_credit)}`, color: "text-blue-600" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-[#6b675d]">{r.label}</span>
                    <span className={r.color}>{r.val}</span>
                  </div>
                ))}
                <div className="border-t border-[#e8e2d5] my-1" />
                <div className="flex justify-between items-center bg-[#f4ebd9]/50 rounded-lg px-2.5 py-2 border-l-2 border-[#d97706]">
                  <span className="font-bold text-[#b46204]">Balance Tax Payable</span>
                  <span className="font-bold text-[#1a1a2e] text-sm">{INR(tax.net_payable)}</span>
                </div>
              </div>
            ) : (
              <EmptyPanel
                icon={<TrendingUp className="w-5 h-5 text-[#d97706]" />}
                title="Tax not calculated yet"
                desc="Ask the agent to calculate your tax, or upload a payout PDF to get started"
              />
            )}
          </div>

          {/* Platform Breakdown */}
          <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#d97706]" />
              <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Income by Platform</span>
            </div>
            {hasIncome ? (
              <div className="space-y-2">
                {Object.entries(income!.platform_breakdown).map(([platform, data]) => {
                  const pct = income!.total_gross_income > 0
                    ? (data.gross / income!.total_gross_income) * 100
                    : 0;
                  return (
                    <div key={platform}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-[#1a1a2e] capitalize">{platform}</span>
                        <span className="text-[#6b675d]">{INR(data.gross)} · {data.count} entries</span>
                      </div>
                      <div className="w-full bg-[#f4ebd9] rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-[#d97706] h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-[10px] text-[#8c8577] pt-1">TDS deducted: {INR(income!.total_tds_deducted)} total</p>
              </div>
            ) : (
              <EmptyPanel
                icon={<UploadCloud className="w-5 h-5 text-[#d97706]" />}
                title="No income data"
                desc='Attach a payout PDF in the chat using the 📎 button'
              />
            )}
          </div>

          {/* All Deadlines */}
          {deadlines?.installments && deadlines.installments.length > 0 && (
            <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#d97706]" />
                <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Full Advance Tax Schedule</span>
              </div>
              <div className="space-y-2">
                {deadlines.installments.map((d, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs p-2.5 rounded-lg ${
                    d.status === "paid" ? "bg-green-50 border border-green-100" :
                    d.status === "overdue" ? "bg-red-50 border border-red-100" :
                    d.status === "due" ? "bg-amber-50 border border-amber-100" :
                    "bg-[#f4ebd9]/30 border border-[#e8e2d5]"
                  }`}>
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{d.installment}</p>
                      <p className="text-[10px] text-[#8c8577]">{new Date(d.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {d.cumulative_percent}%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1a1a2e]">{INR(d.amount_due)}</p>
                      <span className={`text-[9px] font-bold uppercase ${
                        d.status === "paid" ? "text-green-600" :
                        d.status === "overdue" ? "text-red-600" :
                        d.status === "due" ? "text-amber-700" :
                        "text-[#8c8577]"
                      }`}>{d.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
