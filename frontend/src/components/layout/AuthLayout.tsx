/**
 * Shared auth layout — used by both Login and Register pages.
 * Left: dark editorial panel with logo, tagline, perks, testimonial.
 * Right: warm textured panel with animated dashboard preview + Clerk widget on top.
 */
import { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Calendar, FileText, IndianRupee } from "lucide-react";

// ── Mini animated dashboard widget ───────────────────────────────────────────

function MiniDashboard() {
  const bars = [65, 85, 42, 90, 58, 76, 38];

  return (
    <div className="w-full rounded-2xl bg-white border border-[#e8e2d5] shadow-xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#faf7f2] border-b border-[#e8e2d5]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
        <div className="flex-1 mx-3 bg-[#e8e2d5]/70 rounded-full h-4 flex items-center px-2">
          <span className="text-[9px] text-[#8c8577]">app.gigsaathi.in/dashboard</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 space-y-3 bg-[#faf7f2]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-[#d97706] uppercase tracking-wider">FY 2025–26</p>
            <p className="font-['Playfair_Display'] text-sm font-bold text-[#1a1a2e]">Priya's Tax Summary</p>
          </div>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">● Active</span>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <IndianRupee className="w-3 h-3 text-[#d97706]" />, label: "Earnings", val: "₹8.4L" },
            { icon: <FileText className="w-3 h-3 text-[#d97706]" />,    label: "Tax Due",  val: "₹10,400" },
            { icon: <Calendar className="w-3 h-3 text-[#d97706]" />,    label: "Next Due", val: "15 Sep" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-2.5 border border-[#e8e2d5]">
              {s.icon}
              <p className="text-[8px] text-[#8c8577] mt-0.5">{s.label}</p>
              <p className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Platform bars */}
        <div className="bg-white rounded-xl p-3 border border-[#e8e2d5] space-y-2">
          <p className="text-[9px] font-bold text-[#8c8577] uppercase tracking-wider">Income by Platform</p>
          {[
            { name: "Upwork",   pct: 62, val: "₹5.2L" },
            { name: "Swiggy",   pct: 25, val: "₹2.1L" },
            { name: "Bank",     pct: 13, val: "₹1.1L" },
          ].map((p, i) => (
            <div key={p.name}>
              <div className="flex justify-between text-[8px] mb-0.5">
                <span className="text-[#6b675d] font-medium">{p.name}</span>
                <span className="font-bold text-[#1a1a2e]">{p.val}</span>
              </div>
              <div className="w-full bg-[#f4ebd9] rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-[#d97706] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.pct}%` }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="bg-white rounded-xl p-3 border border-[#e8e2d5]">
          <p className="text-[9px] font-bold text-[#8c8577] uppercase tracking-wider mb-2">Monthly Income</p>
          <div className="flex items-end gap-1 h-10">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-[#f4ebd9] rounded-sm overflow-hidden relative"
                style={{ height: "100%" }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-[#d97706] rounded-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Floating badges ───────────────────────────────────────────────────────────

function FloatingBadge({
  icon, label, value, delay, className,
}: {
  icon: ReactNode; label: string; value: string; delay: number; className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
      transition={{ delay, duration: 0.4, y: { delay: delay + 0.4, duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      className={`absolute flex items-center gap-2 bg-white border border-[#e8e2d5] rounded-xl px-3 py-2 shadow-md ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-[#f4ebd9] flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] text-[#8c8577] font-medium leading-none">{label}</p>
        <p className="text-xs font-bold text-[#1a1a2e] leading-none mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

// ── Auth layout props ─────────────────────────────────────────────────────────

interface AuthLayoutProps {
  children: ReactNode;
  heading: ReactNode;
  subheading: string;
  perks: string[];
  testimonial?: { quote: string; name: string; initials: string };
}

// ── Main shared layout ────────────────────────────────────────────────────────

export function AuthLayout({ children, heading, subheading, perks, testimonial }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#faf7f2]">

      {/* ── Left panel — dark editorial ── */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] xl:w-[440px] shrink-0 bg-[#1a1a2e] px-10 xl:px-12 py-12">
        {/* Logo */}
        <Link href="/">
          <span className="font-['Playfair_Display'] text-2xl font-bold text-white cursor-pointer hover:text-[#d97706] transition-colors">
            GigSaathi.
          </span>
        </Link>

        {/* Middle content */}
        <div className="space-y-8">
          {/* Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/10 border border-[#d97706]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
              <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">India's Gig Tax Platform</span>
            </div>
            <div className="font-['Playfair_Display'] text-4xl xl:text-[2.6rem] font-bold text-white leading-tight">
              {heading}
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{subheading}</p>
          </div>

          {/* Perks */}
          <div className="space-y-2.5">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#d97706] shrink-0" />
                {p}
              </div>
            ))}
          </div>

          {/* Platform logos row */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Works with</p>
            <div className="flex flex-wrap gap-2">
              {["Swiggy", "Uber", "Upwork", "Fiverr", "Zomato", "Ola"].map(p => (
                <span key={p} className="text-[10px] font-semibold text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {testimonial && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex gap-0.5">
                {Array.from({length:5}).map((_,i) => (
                  <span key={i} className="text-[#d97706] text-xs">★</span>
                ))}
              </div>
              <p className="text-sm text-white/70 italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-2.5 pt-1 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#d97706]/20 border border-[#d97706]/30 flex items-center justify-center text-xs font-bold text-[#d97706]">
                  {testimonial.initials}
                </div>
                <span className="text-xs text-white/50">{testimonial.name}</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-white/20">© 2025 GigSaathi · For Indian gig workers · Not a CA firm</p>
      </div>

      {/* ── Right panel — warm with live preview ── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Form column */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 lg:px-12 xl:px-16 order-2 lg:order-1">
          {/* Mobile logo */}
          <Link href="/">
            <span className="lg:hidden font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] mb-10 block cursor-pointer">
              GigSaathi.
            </span>
          </Link>

          {/* Form wrapper — gives the Clerk widget a proper frame */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>

        {/* Preview column — animated dashboard */}
        <div className="hidden xl:flex w-[380px] shrink-0 items-center justify-center bg-[#f4ebd9]/30 border-l border-[#e8e2d5] px-8 py-12 relative overflow-hidden order-1 lg:order-2">
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97706]/5 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d97706]/5 rounded-full -translate-x-1/3 translate-y-1/3" />

          <div className="relative w-full space-y-5">
            {/* Section header */}
            <div className="text-center">
              <p className="text-xs font-bold text-[#8c8577] uppercase tracking-wider mb-1">Live Preview</p>
              <p className="font-['Playfair_Display'] text-lg font-semibold text-[#1a1a2e]">Your dashboard awaits</p>
            </div>

            {/* Dashboard preview */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MiniDashboard />
            </motion.div>

            {/* Floating badges */}
            <FloatingBadge
              icon={<TrendingUp className="w-3.5 h-3.5 text-[#d97706]" />}
              label="Tax Saved"
              value="₹18,400"
              delay={0.8}
              className="-top-4 -left-2"
            />
            <FloatingBadge
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              label="ITR-4 Status"
              value="Ready to file"
              delay={1.2}
              className="-bottom-4 -right-2"
            />

            {/* Reassurance text */}
            <p className="text-center text-[11px] text-[#8c8577] leading-relaxed">
              This is what your dashboard looks like after uploading your first PDF. Takes under 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
