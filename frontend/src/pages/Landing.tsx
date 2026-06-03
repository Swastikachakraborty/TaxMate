import { Link } from "wouter";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import {
  FileText, MessageSquare, Download, Shield, TrendingUp,
  ArrowRight, Sparkles, BarChart3, IndianRupee, LayoutDashboard,
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FEATURES = [
  {
    icon: FileText,
    title: "Smart Document Parsing",
    desc: "Upload PDFs from Upwork, Swiggy, Uber or any bank. Our AI reads them instantly and organises your income by platform.",
  },
  {
    icon: MessageSquare,
    title: "AI Tax Chat Assistant",
    desc: "Ask anything — deductions, deadlines, advance tax. Get plain-language answers backed by the latest Income Tax Act.",
  },
  {
    icon: BarChart3,
    title: "Real-time Tax Dashboard",
    desc: "See your gross income, 44ADA deductions, tax liability and balance due in one beautiful view — updated live.",
  },
  {
    icon: Download,
    title: "ITR-4 Worksheet Export",
    desc: "Generate a ready-to-use computation worksheet with a single click. Download as PDF and hand it to your CA.",
  },
  {
    icon: TrendingUp,
    title: "Advance Tax Planner",
    desc: "Never miss an advance tax deadline again. Track June, September, December and March instalments automatically.",
  },
  {
    icon: Shield,
    title: "Section 44ADA Optimised",
    desc: "Built specifically for freelancers and gig workers who qualify for presumptive taxation under Section 44ADA.",
  },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Sign up in under 30 seconds — no credit card required." },
  { n: "02", title: "Upload your statements", desc: "Drop PDFs from your platforms. AI parses everything automatically." },
  { n: "03", title: "Review your tax summary", desc: "See income breakdown, deductions and exact tax liability." },
  { n: "04", title: "Export and file", desc: "Download your worksheet and file ITR-4 confidently." },
];

const STATS = [
  { val: "₹0", label: "Hidden fees" },
  { val: "44ADA", label: "Optimised for" },
  { val: "< 5 min", label: "To file ready" },
  { val: "ITR-4", label: "Auto-recommended" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Upwork designer + Swiggy partner",
    quote: "I used to dread tax season. TaxEase took my PDFs and gave me the exact number I owed in seconds. My CA was genuinely impressed.",
    initials: "PS",
  },
  {
    name: "Rohan Mehta",
    role: "Freelance developer",
    quote: "The advance tax planner alone is worth it. I never knew about the quarterly deadlines before — TaxEase reminded me every single time.",
    initials: "RM",
  },
  {
    name: "Anjali Nair",
    role: "Content creator & Ola partner",
    quote: "Finally a tax tool that understands that my income comes from five different apps. Everything just works.",
    initials: "AN",
  },
];

export default function Landing() {
  // Try to use Clerk — gracefully fall back if no Clerk key
  let isSignedIn = false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isSignedIn: clerkSignedIn, isLoaded } = useUser();
    if (isLoaded) isSignedIn = !!clerkSignedIn;
  } catch {
    // No Clerk provider — dev/no-auth mode
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1a1a2e]">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[#faf7f2]/90 backdrop-blur-sm border-b border-[#e8e2d5]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-['Playfair_Display'] text-2xl font-bold tracking-tight">TaxEase.</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6b675d]">
            <a href="#features" className="hover:text-[#1a1a2e] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#1a1a2e] transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-[#1a1a2e] transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/app">
                <button className="h-9 px-5 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="h-9 px-5 rounded-full border border-[#1a1a2e] text-sm font-medium text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all">
                    Sign in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="h-9 px-5 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white text-sm font-medium transition-all shadow-sm">
                    Get started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4ebd9] border border-[#d97706]/20 text-sm font-medium text-[#b46204] mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Built for Indian freelancers & gig workers
          </motion.div>
          <motion.h1 variants={fade} className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold text-[#1a1a2e] leading-tight tracking-tight mb-6">
            Tax filing,<br />
            <span className="text-[#d97706]">made beautiful.</span>
          </motion.h1>
          <motion.p variants={fade} className="text-lg md:text-xl text-[#6b675d] leading-relaxed mb-10 max-w-xl">
            TaxEase turns your scattered invoices and bank statements into a clear, complete ITR-4 worksheet — in minutes, not days.
          </motion.p>
          <motion.div variants={fade} className="flex flex-wrap gap-4">
            {isSignedIn ? (
              <Link href="/app">
                <button className="h-12 px-8 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white font-medium flex items-center gap-2 transition-all shadow-md">
                  <LayoutDashboard className="w-4 h-4" /> Open Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <button className="h-12 px-8 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white font-medium flex items-center gap-2 transition-all shadow-md">
                    Start for free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="h-12 px-8 rounded-full border border-[#e8e2d5] hover:border-[#d97706]/40 text-[#1a1a2e] font-medium hover:bg-[#f4ebd9]/30 transition-all">
                    Sign in to your account
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Hero visual — editorial stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#e8e2d5] bg-[#fdfbf7] px-6 py-5">
              <p className="font-['Playfair_Display'] text-3xl font-bold text-[#d97706] mb-1">{s.val}</p>
              <p className="text-sm text-[#8c8577] font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Dashboard preview */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-[#e8e2d5] bg-[#fdfbf7] overflow-hidden shadow-[0_8px_48px_rgba(26,26,46,0.08)]">
          {/* mock browser bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#e8e2d5] bg-[#faf7f2]">
            <div className="flex gap-1.5">
              {["bg-red-300","bg-yellow-300","bg-green-300"].map(c => <span key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
            </div>
            <div className="flex-1 mx-4 bg-[#e8e2d5]/60 rounded-full h-5 flex items-center px-3">
              <span className="text-xs text-[#8c8577]">app.taxease.in/dashboard</span>
            </div>
          </div>
          {/* mock dashboard content */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-[#d97706] uppercase tracking-wider mb-1">FY 2024–2025</p>
                <p className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e]">Priya's Annual Summary</p>
              </div>
              <div className="flex gap-2">
                <div className="h-8 px-4 rounded-full border border-[#e8e2d5] text-xs flex items-center text-[#6b675d]">Download Report</div>
                <div className="h-8 px-4 rounded-full bg-[#d97706] text-xs flex items-center text-white">Pay Balance</div>
              </div>
            </div>
            <div className="rounded-xl border border-[#e8e2d5] p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8c8577] uppercase tracking-wider mb-1">Total Gross Income</p>
                <p className="font-['Playfair_Display'] text-4xl font-bold text-[#1a1a2e]">₹8,40,000</p>
              </div>
              <div className="flex gap-6 text-sm">
                {[["Upwork","₹5,20,000"],["Swiggy","₹2,10,000"],["Interest","₹10,000"]].map(([l,v]) => (
                  <div key={l}>
                    <p className="text-xs text-[#8c8577] mb-0.5">{l}</p>
                    <p className="font-semibold text-[#1a1a2e]">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Tax Liability", val: "₹84,500", color: "text-[#1a1a2e]" },
                { label: "Advance Paid", val: "₹42,000", color: "text-blue-500" },
                { label: "Balance Due", val: "₹42,500", color: "text-[#d97706]" },
                { label: "Deadline", val: "Jun 15", color: "text-red-500" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] p-4">
                  <p className="text-xs text-[#8c8577] mb-1">{c.label}</p>
                  <p className={`font-['Playfair_Display'] text-xl font-bold ${c.color}`}>{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#e8e2d5]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-sm font-semibold text-[#d97706] uppercase tracking-wider mb-3">What's included</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1a1a2e] max-w-lg leading-tight">
            Every tool a freelancer needs
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-[#e8e2d5] bg-[#fdfbf7] p-6 hover:shadow-md hover:border-[#d97706]/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f4ebd9] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#d97706]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1a1a2e] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6b675d] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[#1a1a2e] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-sm font-semibold text-[#d97706] uppercase tracking-wider mb-3">Simple process</p>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white max-w-lg leading-tight">
              From messy PDFs to filed return
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="space-y-4"
              >
                <p className="font-['Playfair_Display'] text-5xl font-bold text-[#d97706]/30">{s.n}</p>
                <h3 className="font-['Playfair_Display'] text-xl font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#e8e2d5]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-sm font-semibold text-[#d97706] uppercase tracking-wider mb-3">Loved by freelancers</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1a1a2e] max-w-lg leading-tight">
            Real people, real peace of mind
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-[#e8e2d5] bg-[#fdfbf7] p-6 space-y-4"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-[#d97706] text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-[#1a1a2e] leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#e8e2d5]">
                <div className="w-9 h-9 rounded-full bg-[#f4ebd9] border border-[#e8e2d5] flex items-center justify-center text-xs font-bold text-[#d97706]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{t.name}</p>
                  <p className="text-xs text-[#8c8577]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-[#1a1a2e] px-8 md:px-14 py-14 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-white mb-3">
              Ready to file with confidence?
            </h2>
            <p className="text-white/60 max-w-md">
              Join thousands of Indian freelancers who've simplified their tax filing with TaxEase.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {isSignedIn ? (
              <Link href="/app">
                <button className="h-12 px-8 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white font-semibold flex items-center gap-2 transition-all">
                  <LayoutDashboard className="w-4 h-4" /> Open my Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <button className="h-12 px-8 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white font-semibold flex items-center gap-2 transition-all">
                    Get started free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="h-12 px-8 rounded-full border border-white/20 text-white hover:bg-white/10 font-medium transition-all">
                    Sign in
                  </button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e2d5] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a2e]">TaxEase.</span>
          <p className="text-sm text-[#8c8577]">Built for Indian freelancers. © 2025 TaxEase. For informational use only.</p>
          <div className="flex items-center gap-1 text-xs text-[#8c8577]">
            <IndianRupee className="w-3.5 h-3.5 text-[#d97706]" />
            Optimised for Section 44ADA
          </div>
        </div>
      </footer>
    </div>
  );
}
