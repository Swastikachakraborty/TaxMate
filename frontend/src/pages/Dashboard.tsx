import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Calendar, FileText, UploadCloud,
  Loader2, RefreshCw, User, Check, ChevronRight,
  AlertCircle, IndianRupee, Zap,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { api, type IncomeSummary, type TaxResult, type DeadlinesResult, type UserProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

// ── Helpers ────────────────────────────────────────────────────────────────────

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATES_OF_INDIA = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other",
];

const OCCUPATIONS = [
  { value: "freelancer", label: "Freelancer / Professional", sub: "Upwork, Fiverr, consulting" },
  { value: "delivery",   label: "Delivery Partner",          sub: "Swiggy, Zomato, Dunzo" },
  { value: "rideshare",  label: "Rideshare Driver",          sub: "Uber, Ola, Rapido" },
  { value: "mixed",      label: "Multiple Platforms",        sub: "Income from 2+ source types" },
];

type OnboardStep = 1 | 2 | 3;
interface OnboardData {
  name: string; age: string; state: string;
  occupation_type: string; pan_number: string; opted_44ADA: boolean;
}

// ── Onboarding Wizard ──────────────────────────────────────────────────────────

function OnboardingWizard({ open, initialName, userId, onComplete }: {
  open: boolean; initialName: string; userId: string; onComplete: () => void;
}) {
  const [step, setStep] = useState<OnboardStep>(1);
  const [data, setData] = useState<OnboardData>({
    name: initialName, age: "", state: "Maharashtra",
    occupation_type: "freelancer", pan_number: "", opted_44ADA: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialName && !data.name) setData(d => ({ ...d, name: initialName }));
  }, [initialName]);

  function set<K extends keyof OnboardData>(key: K, value: OnboardData[K]) {
    setData(d => ({ ...d, [key]: value }));
    setError("");
  }

  function nextStep() {
    if (step === 1) {
      if (!data.name.trim()) { setError("Please enter your name."); return; }
      const age = parseInt(data.age);
      if (!data.age || isNaN(age) || age < 18 || age > 80) { setError("Enter a valid age (18–80)."); return; }
    }
    if (step === 2 && !data.state) { setError("Please select your state."); return; }
    setStep(s => (s + 1) as OnboardStep);
    setError("");
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      await api.createUser({
        user_id: userId,
        name: data.name.trim(),
        state: data.state,
        occupation_type: data.occupation_type,
        age: parseInt(data.age),
        opted_44ADA: data.opted_44ADA,
        pan_number: data.pan_number.trim().toUpperCase() || undefined,
      });
      onComplete();
    } catch (err: any) {
      if ((err.message ?? "").toLowerCase().includes("already exists")) { onComplete(); return; }
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inp = "w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30 transition-all placeholder:text-[#c4b99d]";
  const lbl = "block text-xs font-bold text-[#1a1a2e] uppercase tracking-wider mb-1.5";

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl shadow-2xl outline-none p-0 overflow-hidden">
        {/* Header with progress */}
        <div className="bg-[#1a1a2e] px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            {([1, 2, 3] as OnboardStep[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? "bg-[#d97706] text-white" :
                  step === s ? "bg-white text-[#1a1a2e]" :
                  "bg-white/20 text-white/40"
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-10 rounded ${step > s ? "bg-[#d97706]" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
          <DialogTitle className="text-white font-['Playfair_Display'] text-xl font-bold leading-none">
            {step === 1 ? "Welcome to GigSaathi" : step === 2 ? "Your Location & Work" : "Tax Preferences"}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-xs mt-1">
            {step === 1 ? "Let's set up your profile to calculate your taxes accurately." :
             step === 2 ? "This helps us apply the correct state tax rules." :
             "Used for ITR-4 generation. PAN is optional but recommended."}
          </DialogDescription>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className={lbl}>Full Name</label>
                <input autoFocus value={data.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Priya Sharma" className={inp} />
              </div>
              <div>
                <label className={lbl}>Age</label>
                <input type="number" value={data.age} onChange={e => set("age", e.target.value)} placeholder="25" min="18" max="80" className={inp} />
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className={lbl}>State</label>
                <select value={data.state} onChange={e => set("state", e.target.value)} className={inp}>
                  {STATES_OF_INDIA.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Primary Work Type</label>
                <div className="space-y-2">
                  {OCCUPATIONS.map(o => (
                    <button key={o.value} type="button" onClick={() => set("occupation_type", o.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                        data.occupation_type === o.value ? "border-[#d97706] bg-[#f4ebd9]/50" : "border-[#e8e2d5] hover:border-[#d97706]/40"
                      }`}>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">{o.label}</p>
                        <p className="text-xs text-[#8c8577]">{o.sub}</p>
                      </div>
                      {data.occupation_type === o.value && (
                        <div className="w-5 h-5 rounded-full bg-[#d97706] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <label className={lbl}>PAN Number <span className="text-[#8c8577] normal-case font-normal">(optional)</span></label>
                <input value={data.pan_number} onChange={e => set("pan_number", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className={`${inp} uppercase`} />
                <p className="text-[10px] text-[#8c8577] mt-1">Required for ITR-4 filing. You can add this later.</p>
              </div>
              <div>
                <label className={lbl}>Taxation Method</label>
                <div className="space-y-2">
                  {[
                    { val: true,  label: "Section 44ADA — Presumptive",  sub: "50% of income auto-exempt. Recommended for most gig workers." },
                    { val: false, label: "Regular Taxation",             sub: "Track actual expenses and claim deductions manually." },
                  ].map(opt => (
                    <button key={String(opt.val)} type="button" onClick={() => set("opted_44ADA", opt.val)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                        data.opted_44ADA === opt.val ? "border-[#d97706] bg-[#f4ebd9]/50" : "border-[#e8e2d5] hover:border-[#d97706]/40"
                      }`}>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">{opt.label}</p>
                        <p className="text-xs text-[#8c8577] mt-0.5">{opt.sub}</p>
                      </div>
                      {data.opted_44ADA === opt.val && (
                        <div className="w-5 h-5 rounded-full bg-[#d97706] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as OnboardStep)}
              className="h-11 px-5 rounded-xl border border-[#e8e2d5] text-sm font-medium text-[#6b675d] hover:bg-[#f4ebd9]/30 transition-colors">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep}
              className="flex-1 h-11 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting}
              className="flex-1 h-11 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Setting up…</> : <>Save Profile <ChevronRight className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Card primitives ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon, title, right }: { icon: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#e8e2d5]">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#f4ebd9] flex items-center justify-center">{icon}</div>
        <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">{title}</span>
      </div>
      {right}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-[#f4ebd9]/50 rounded-xl animate-pulse ${className}`} />;
}

function EmptyState({ icon, title, desc, action }: {
  icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-[#f4ebd9] flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{title}</p>
        <p className="text-xs text-[#8c8577] max-w-xs mx-auto mt-1 leading-relaxed">{desc}</p>
      </div>
      {action}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { userId, name, isLoaded } = useAuth();
  const uid = userId ?? "";
  const qc = useQueryClient();

  const [showOnboarding, setShowOnboarding] = useState(false);

  const userQ = useQuery<UserProfile>({
    queryKey: ["userProfile", uid],
    queryFn: () => api.getUser(uid),
    enabled: !!uid && isLoaded,
    retry: false,
  });

  const isNewUser =
    !!uid && userQ.isError &&
    ((userQ.error as any)?.message?.toLowerCase().includes("not found") ||
      (userQ.error as any)?.status === 404);

  const profileReady = !!uid && !!userQ.data;

  useEffect(() => {
    if (isNewUser && !userQ.isLoading) setShowOnboarding(true);
  }, [isNewUser, userQ.isLoading]);

  const incomeQ = useQuery<IncomeSummary>({
    queryKey: ["income", uid],
    queryFn: () => api.getIncome(uid),
    enabled: profileReady,
    retry: false,
  });
  const taxQ = useQuery<TaxResult>({
    queryKey: ["tax", uid],
    queryFn: () => api.getTax(uid),
    enabled: profileReady,
    retry: false,
  });
  const deadlinesQ = useQuery<DeadlinesResult>({
    queryKey: ["deadlines", uid],
    queryFn: () => api.getDeadlines(uid),
    enabled: profileReady,
    retry: false,
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["income", uid] });
    qc.invalidateQueries({ queryKey: ["tax", uid] });
    qc.invalidateQueries({ queryKey: ["deadlines", uid] });
  }

  function handleOnboardComplete() {
    setShowOnboarding(false);
    qc.invalidateQueries({ queryKey: ["userProfile", uid] });
    refresh();
  }

  const income   = incomeQ.data;
  const tax      = taxQ.data;
  const dl       = deadlinesQ.data;
  const hasData  = (income?.record_count ?? 0) > 0;
  const next     = dl?.next_deadline;

  const user = userQ.data;

  return (
    <div className="h-full overflow-y-auto bg-[#faf7f2] pb-20 md:pb-0">
      <OnboardingWizard
        open={showOnboarding}
        initialName={name ?? ""}
        userId={uid}
        onComplete={handleOnboardComplete}
      />

      {/* ── Page header ── */}
      <div className="sticky top-0 z-10 bg-[#faf7f2]/90 backdrop-blur-sm border-b border-[#e8e2d5]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-widest leading-none">FY 2025–26</p>
            <h1 className="font-['Playfair_Display'] text-lg font-semibold text-[#1a1a2e] leading-tight">
              {user?.name ?? name ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={refresh}
              disabled={incomeQ.isFetching || taxQ.isFetching}
              className="w-8 h-8 rounded-lg border border-[#e8e2d5] flex items-center justify-center text-[#8c8577] hover:text-[#d97706] hover:border-[#d97706]/30 transition-all disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${incomeQ.isFetching ? "animate-spin" : ""}`} />
            </button>

            {/* Status chip */}
            {userQ.isLoading || !isLoaded ? (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#8c8577] bg-[#f4ebd9]/40 border border-[#e8e2d5] px-2.5 py-1 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading…
              </span>
            ) : isNewUser ? (
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-[#d97706] bg-[#f4ebd9] border border-[#d97706]/20 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors"
              >
                <User className="w-3 h-3" /> Complete Profile
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 space-y-5">

        {/* ── Setup banner for new users ── */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-[#1a1a2e] text-white rounded-2xl px-5 py-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d97706]/20 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-[#d97706]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Welcome! Let's set up your profile.</p>
              <p className="text-xs text-white/60 mt-0.5">It takes under 60 seconds. We need a few details to calculate your tax correctly.</p>
            </div>
            <button
              onClick={() => setShowOnboarding(true)}
              className="shrink-0 h-9 px-5 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Gross Earnings",
              value: incomeQ.isLoading ? null : hasData ? INR(income!.total_gross_income) : "—",
              sub: hasData ? `${income!.record_count} transactions` : "No income data yet",
              icon: <TrendingUp className="w-4 h-4 text-[#d97706]" />,
              accent: "text-[#1a1a2e]",
            },
            {
              label: "Tax Payable",
              value: taxQ.isLoading ? null : tax ? INR(tax.total_tax) : "—",
              sub: tax ? "44ADA presumptive" : "Not calculated yet",
              icon: <FileText className="w-4 h-4 text-[#d97706]" />,
              accent: "text-[#1a1a2e]",
            },
            {
              label: "Balance Due",
              value: taxQ.isLoading ? null : tax ? INR(tax.net_payable) : "—",
              sub: tax ? `TDS: ${INR(tax.tds_credit)}` : "After TDS deduction",
              icon: <IndianRupee className="w-4 h-4 text-[#d97706]" />,
              accent: tax && tax.net_payable > 0 ? "text-red-600" : "text-green-600",
            },
            {
              label: "Next Deadline",
              value: deadlinesQ.isLoading ? null : next ? INR(next.amount_due) : "—",
              sub: next ? next.due_date : "No advance tax due",
              icon: <Calendar className="w-4 h-4 text-[#d97706]" />,
              accent: next?.alert_level === "urgent" ? "text-red-600" : "text-[#d97706]",
            },
          ].map(c => (
            <div key={c.label} className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f4ebd9] flex items-center justify-center shrink-0">{c.icon}</div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-[#8c8577] uppercase tracking-widest mb-1">{c.label}</p>
                  {c.value === null ? (
                    <Skeleton className="h-5 w-20 mt-1" />
                  ) : (
                    <p className={`text-base font-bold leading-none ${c.accent}`}>{c.value}</p>
                  )}
                  <p className="text-[10px] text-[#8c8577] mt-1 truncate">{c.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Tax Computation ── */}
          <Card>
            <CardHeader
              icon={<FileText className="w-3.5 h-3.5 text-[#d97706]" />}
              title="Tax Computation"
              right={
                <span className="text-[9px] font-bold text-[#d97706] bg-[#f4ebd9] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Section 44ADA
                </span>
              }
            />
            <div className="px-5 py-4">
              {taxQ.isLoading ? (
                <div className="space-y-3">
                  {[80, 64, 72, 56].map(w => <Skeleton key={w} className={`h-4 w-${w}%`} />)}
                </div>
              ) : tax ? (
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: "Gross Receipts",          val: INR(tax.gross_income),         style: "text-[#1a1a2e] font-semibold" },
                    { label: "50% Presumptive Deduction", val: `−${INR(tax.deduction_44ada)}`, style: "text-[#b45309]" },
                    { label: "Net Taxable Income",       val: INR(tax.net_taxable_income),   style: "text-[#1a1a2e] font-semibold border-t border-[#e8e2d5] pt-2.5 mt-0.5" },
                    { label: "Tax + 4% Cess",            val: INR(tax.total_tax),            style: "text-[#1a1a2e]" },
                    { label: "TDS Deducted",             val: `−${INR(tax.tds_credit)}`,     style: "text-blue-600" },
                  ].map(r => (
                    <div key={r.label} className={`flex justify-between ${r.style}`}>
                      <span className="text-[#6b675d] font-normal">{r.label}</span>
                      <span>{r.val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-[#f4ebd9]/60 rounded-xl px-3 py-2.5 mt-1 border-l-2 border-[#d97706]">
                    <span className="text-xs font-bold text-[#b46204]">Balance Tax Due</span>
                    <span className="font-bold text-[#1a1a2e]">{INR(tax.net_payable)}</span>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<Zap className="w-5 h-5 text-[#d97706]" />}
                  title="Tax not calculated yet"
                  desc='Go to AI Tax Chat and ask "Calculate my tax" after uploading your income data.'
                  action={
                    <Link href="/app/chat">
                      <button className="text-xs font-semibold text-[#d97706] border border-[#d97706]/30 px-3 py-1.5 rounded-full hover:bg-[#f4ebd9]/40 transition-colors">
                        Open AI Tax Chat →
                      </button>
                    </Link>
                  }
                />
              )}
            </div>
          </Card>

          {/* ── Income by Platform ── */}
          <Card>
            <CardHeader
              icon={<TrendingUp className="w-3.5 h-3.5 text-[#d97706]" />}
              title="Income by Platform"
            />
            <div className="px-5 py-4">
              {incomeQ.isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-8" />)}
                </div>
              ) : hasData ? (
                <div className="space-y-4">
                  {Object.entries(income!.platform_breakdown).map(([platform, d]) => {
                    const pct = income!.total_gross_income > 0 ? (d.gross / income!.total_gross_income) * 100 : 0;
                    return (
                      <div key={platform}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-[#1a1a2e] capitalize">{platform}</span>
                          <div className="text-right">
                            <span className="font-bold text-[#1a1a2e]">{INR(d.gross)}</span>
                            <span className="text-[#8c8577] ml-2">{d.count} entries</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#f4ebd9] rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className="bg-[#d97706] h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-[10px] text-[#8c8577] mt-1">TDS: {INR(d.tds)} · {pct.toFixed(1)}% of total</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<UploadCloud className="w-5 h-5 text-[#d97706]" />}
                  title="No income data yet"
                  desc="Upload payout PDFs from Swiggy, Uber, Upwork or your bank to get started."
                  action={
                    <Link href="/app/upload">
                      <button className="text-xs font-semibold text-[#d97706] border border-[#d97706]/30 px-3 py-1.5 rounded-full hover:bg-[#f4ebd9]/40 transition-colors">
                        Upload Documents →
                      </button>
                    </Link>
                  }
                />
              )}
            </div>
          </Card>

          {/* ── Advance Tax Schedule ── */}
          <Card className="lg:col-span-2">
            <CardHeader
              icon={<Calendar className="w-3.5 h-3.5 text-[#d97706]" />}
              title="Advance Tax Schedule — FY 2025–26"
              right={
                next?.alert_level === "urgent" ? (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                    Deadline approaching!
                  </span>
                ) : undefined
              }
            />
            <div className="px-5 py-4">
              {deadlinesQ.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12" />)}
                </div>
              ) : dl?.installments?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dl.installments.map((inst, i) => (
                    <div key={i} className={`rounded-xl p-3.5 border ${
                      inst.status === "paid"    ? "bg-green-50 border-green-100" :
                      inst.status === "overdue" ? "bg-red-50 border-red-100"    :
                      inst.status === "due"     ? "bg-amber-50 border-amber-100" :
                      "bg-[#f4ebd9]/30 border-[#e8e2d5]"
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c8577]">Instalment {i + 1}</span>
                        <span className={`text-[9px] font-bold uppercase ${
                          inst.status === "paid"    ? "text-green-600" :
                          inst.status === "overdue" ? "text-red-600"   :
                          inst.status === "due"     ? "text-amber-700" :
                          "text-[#8c8577]"
                        }`}>{inst.status}</span>
                      </div>
                      <p className="text-base font-bold text-[#1a1a2e]">{INR(inst.amount_due)}</p>
                      <p className="text-xs text-[#6b675d] mt-0.5">
                        {new Date(inst.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[10px] text-[#8c8577] mt-1">{inst.cumulative_percent}% cumulative</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Calendar className="w-5 h-5 text-[#d97706]" />}
                  title="Advance tax schedule not available"
                  desc="The agent will generate your quarterly advance tax schedule after calculating your tax liability."
                  action={
                    <Link href="/app/chat">
                      <button className="text-xs font-semibold text-[#d97706] border border-[#d97706]/30 px-3 py-1.5 rounded-full hover:bg-[#f4ebd9]/40 transition-colors">
                        Ask AI Tax Chat →
                      </button>
                    </Link>
                  }
                />
              )}
            </div>
          </Card>

          {/* ── Profile Card ── */}
          {user && (
            <Card className="lg:col-span-2">
              <CardHeader
                icon={<User className="w-3.5 h-3.5 text-[#d97706]" />}
                title="Your Profile"
                right={
                  <span className="text-[10px] font-semibold text-[#6b675d] bg-[#f4ebd9]/40 border border-[#e8e2d5] px-2.5 py-0.5 rounded-full">
                    FY {user.financial_year}
                  </span>
                }
              />
              <div className="px-5 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    { label: "Name",           value: user.name },
                    { label: "State",          value: user.state },
                    { label: "Occupation",     value: user.occupation_type?.replace("_", " ") },
                    { label: "Tax Regime",     value: user.opted_44ADA ? "Section 44ADA" : "Regular" },
                    { label: "PAN",            value: user.pan_number ?? "Not provided" },
                    { label: "Age",            value: String(user.age) },
                    { label: "ITR Form",       value: "ITR-4 (Sugam)" },
                    { label: "Assessment Year", value: "AY 2026–27" },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[10px] font-bold text-[#8c8577] uppercase tracking-wider mb-0.5">{f.label}</p>
                      <p className="font-semibold text-[#1a1a2e] capitalize">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
