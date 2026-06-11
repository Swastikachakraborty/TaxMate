import { motion } from "framer-motion";
import { FileText, Calendar, AlertCircle, UploadCloud, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { api, type TaxResult, type DeadlinesResult } from "@/lib/api";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// Sample data shown when backend is unavailable / no data
const DEMO_TAX: TaxResult = {
  user_id: "demo",
  gross_income: 840000,
  deduction_44ada: 420000,
  net_taxable_income: 420000,
  tax_before_cess: 10000,
  cess: 400,
  total_tax: 10400,
  tds_credit: 4200,
  net_payable: 6200,
  slab_breakdown: [
    { range: "₹0 – ₹3,00,000", rate: "0%", tax: 0 },
    { range: "₹3,00,001 – ₹4,20,000", rate: "5%", tax: 6000 },
  ],
};

const DEMO_DEADLINES: DeadlinesResult = {
  user_id: "demo",
  total_tax: 10400,
  installments: [
    { installment: "1st Instalment", due_date: "2025-06-15", cumulative_percent: 15, amount_due: 1560, status: "paid" },
    { installment: "2nd Instalment", due_date: "2025-09-15", cumulative_percent: 45, amount_due: 3120, status: "upcoming" },
    { installment: "3rd Instalment", due_date: "2025-12-15", cumulative_percent: 75, amount_due: 5200, status: "upcoming" },
    { installment: "4th Instalment", due_date: "2026-03-15", cumulative_percent: 100, amount_due: 6200, status: "upcoming" },
  ],
  next_deadline: { installment: "2nd Instalment", due_date: "2025-09-15", cumulative_percent: 45, amount_due: 3120, status: "upcoming", days_remaining: 96, alert_level: "ok" },
};

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-[#f4ebd9]/50 rounded-xl animate-pulse ${className}`} />;
}

function TaxArc({ percentage }: { percentage: number }) {
  const r = 80, sw = 10;
  const circ = Math.PI * r;
  const filled = circ * (Math.min(percentage, 100) / 100);
  const cx = 110, cy = 110;
  return (
    <svg width="220" height="125" viewBox="0 0 220 125">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e8e2d5" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#d97706" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`} />
      <text x={cx} y={cy - 16} textAnchor="middle" fill="#1a1a2e" fontSize="26" fontWeight="700" fontFamily="'Playfair Display', serif">
        {percentage.toFixed(1)}%
      </text>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#8c8577" fontSize="11" fontFamily="Inter, sans-serif">
        of earnings as tax
      </text>
    </svg>
  );
}

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

export default function TaxSummary() {
  const { userId } = useAuth();
  const uid = userId ?? "demo_user";

  const tax = useQuery<TaxResult>({ queryKey: ["tax", uid], queryFn: () => api.getTax(uid), enabled: !!uid, retry: false });
  const deadlines = useQuery<DeadlinesResult>({ queryKey: ["deadlines", uid], queryFn: () => api.getDeadlines(uid), enabled: !!uid, retry: false });

  const isLoading = tax.isLoading || deadlines.isLoading;
  const isDemo = !tax.data || !!tax.error;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-8">
        <SkeletonBlock className="h-12 w-72" />
        <div className="grid grid-cols-2 gap-6">
          <SkeletonBlock className="h-56" /><SkeletonBlock className="h-56" />
        </div>
        <SkeletonBlock className="h-48" />
      </div>
    );
  }

  const t = isDemo ? DEMO_TAX : tax.data!;
  const dl = isDemo ? DEMO_DEADLINES : (deadlines.data ?? DEMO_DEADLINES);

  const taxPct = t.gross_income > 0 ? (t.total_tax / t.gross_income) * 100 : 0;
  const tdsProgress = t.total_tax > 0 ? Math.min((t.tds_credit / t.total_tax) * 100, 100) : 0;

  const slabSegments = t.slab_breakdown?.map((s) => ({
    label: s.range,
    tax: s.tax,
    rate: s.rate,
  })) ?? [];

  const statusColor: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    due: "bg-[#d97706]/15 text-[#b46204]",
    upcoming: "bg-[#f4ebd9]/60 text-[#8c8577]",
    overdue: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8 overflow-y-auto h-full"
    >
      {/* Demo banner */}
      {isDemo && (
        <motion.div variants={item} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Sample Data दिखाया जा रहा है</p>
            <p className="text-xs text-amber-700 mt-0.5">
              यह real data नहीं है। Backend चालू करें और PDFs upload करें अपना actual tax देखने के लिए।{" "}
              <Link href="/app/upload"><span className="underline font-semibold cursor-pointer">Upload करें →</span></Link>
            </p>
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
        <div>
          <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Tax Computation · टैक्स विवरण</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e]">Tax Summary — FY 2025-26</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8e2d5] bg-[#fdfbf7] text-sm font-medium text-[#1a1a2e] shrink-0">
          <FileText className="w-4 h-4 text-[#d97706]" /> ITR-4 Recommended
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax arc */}
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] flex flex-col items-center py-8 px-4">
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-4">Live Tax Liability</p>
          <TaxArc percentage={taxPct} />
          <p className="mt-4 font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e]">{formatINR(t.total_tax)}</p>
          <p className="text-sm text-[#8c8577] mt-1">Total Tax Payable</p>
          <div className="w-full mt-6 space-y-1.5 px-2">
            <div className="flex justify-between text-xs font-semibold text-[#6b675d]">
              <span>TDS credit</span>
              <span>{formatINR(t.tds_credit)}</span>
            </div>
            <div className="w-full bg-[#f4ebd9] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#d97706] h-full rounded-full" style={{ width: `${tdsProgress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[#8c8577]">
              <span>{tdsProgress.toFixed(0)}% covered</span>
              <span>Balance: {formatINR(t.net_payable)}</span>
            </div>
          </div>
        </motion.div>

        {/* Income computation */}
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577] border-b border-[#e8e2d5] pb-3">Income Computation (आय की गणना)</p>
          <div className="space-y-3 text-sm font-medium">
            {[
              { label: "Gross Earnings (कुल कमाई)", val: formatINR(t.gross_income), color: "text-[#1a1a2e]" },
              { label: "Section 44ADA Deduction (50%)", val: `−${formatINR(t.deduction_44ada)}`, color: "text-[#b45309]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-bold ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5]" />
            {[
              { label: "Net Taxable Income (कर योग्य आय)", val: formatINR(t.net_taxable_income), color: "text-[#1a1a2e]" },
              { label: "Tax + Cess (4%)", val: formatINR(t.total_tax), color: "text-[#1a1a2e]" },
              { label: "TDS Already Deducted (पहले से काटा गया)", val: `−${formatINR(t.tds_credit)}`, color: "text-[#0369a1]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-bold ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5]" />
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#f4ebd9]/50 border-l-2 border-[#d97706]">
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Balance Due · बकाया टैक्स</span>
              <span className="text-base font-bold text-[#1a1a2e]">{formatINR(t.net_payable)}</span>
            </div>
          </div>

          {/* 44ADA explanation */}
          <div className="mt-2 bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-[#4b5563] leading-relaxed">
            <span className="font-semibold text-blue-700">Section 44ADA क्या है?</span> Freelancers और professionals को अपनी gross income का सिर्फ 50% taxable मानना होता है। बाकी 50% automatically exempt है।
          </div>
        </motion.div>
      </div>

      {/* Advance tax schedule */}
      {dl.installments && (
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-5">
          <p className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#d97706]" />Advance Tax Schedule · अग्रिम कर अनुसूची
          </p>
          {dl.next_deadline?.alert_level === "urgent" && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              अगला payment {formatINR(dl.next_deadline.amount_due)} — सिर्फ {dl.next_deadline.days_remaining} दिन बाकी!
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#e8e2d5] text-[#8c8577] font-semibold text-xs uppercase tracking-wider">
                  {["Instalment", "Due Date", "Cumulative %", "Amount Due", "Status"].map((h) => (
                    <th key={h} className="py-2.5 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dl.installments.map((inst, i) => (
                  <tr key={i} className="border-b border-[#e8e2d5]/60 last:border-0">
                    <td className="py-3 pr-4 text-[#6b675d] font-medium">{["1st", "2nd", "3rd", "4th"][i]}</td>
                    <td className="py-3 pr-4 text-[#1a1a2e] font-medium">{inst.due_date}</td>
                    <td className="py-3 pr-4 text-[#1a1a2e] font-semibold">{inst.cumulative_percent}%</td>
                    <td className="py-3 pr-4 font-bold text-[#1a1a2e]">{formatINR(inst.amount_due)}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${statusColor[inst.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {inst.status === "paid" ? "✓ Paid" : inst.status === "upcoming" ? "Upcoming" : inst.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Slab breakdown */}
      {slabSegments.length > 0 && (
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577]">Tax Slab Breakdown — New Regime (नई कर व्यवस्था)</p>
          <div className="space-y-2">
            {slabSegments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-[#6b675d] text-xs">{seg.label} @ {seg.rate}</span>
                <span className="font-semibold text-[#1a1a2e]">{formatINR(seg.tax)}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5] pt-2 flex justify-between text-sm font-bold">
              <span className="text-[#1a1a2e]">Total Tax + 4% Cess</span>
              <span className="text-[#d97706]">{formatINR(t.total_tax)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
