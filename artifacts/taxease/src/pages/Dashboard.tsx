import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  totalIncome, taxLiability, advanceTaxPaid, monthlyIncome,
  recentUploads, formatINR, user, taxBreakdown,
} from "@/lib/data";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`bg-[#f4ebd9]/50 rounded-xl animate-pulse ${className}`} />
  );
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const taxProgress = (advanceTaxPaid / taxLiability) * 100;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-8">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-12 w-80" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-36 w-full" />
        <div className="grid grid-cols-3 gap-6">
          <SkeletonBlock className="col-span-2 h-72" />
          <SkeletonBlock className="h-72" />
        </div>
        <SkeletonBlock className="h-40 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      {/* Header */}
      <motion.header variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024–2025</p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight leading-tight">
            Priya's Annual Summary
          </h1>
          <p className="text-[#6b675d] mt-2 max-w-xl leading-relaxed">
            Freelance designer & Swiggy delivery partner — FY {user.fy}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-11 px-6 rounded-full border border-[#1a1a2e] text-[#1a1a2e] text-sm font-medium hover:bg-[#1a1a2e] hover:text-white transition-all">
            Download Report
          </button>
          <button className="h-11 px-6 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white text-sm font-medium transition-all shadow-sm">
            Pay Balance
          </button>
        </div>
      </motion.header>

      {/* Wide income overview card */}
      <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider mb-1">Total Gross Income</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1a1a2e] financial-num">
              {formatINR(totalIncome)}
            </h2>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8">
            {[
              { label: "Upwork", val: 520000 },
              { label: "Swiggy", val: 210000 },
              { label: "Interest", val: 10000 },
            ].map((s, i) => (
              <div key={i} className={i > 0 ? "md:pl-8 md:border-l border-[#e8e2d5]" : ""}>
                <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-sm font-bold text-[#1a1a2e] financial-num">{formatINR(s.val)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tax progress bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#6b675d] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d97706]" />
              Advance paid: <strong className="text-[#1a1a2e] financial-num ml-1">{formatINR(advanceTaxPaid)}</strong>
            </span>
            <span className="text-[#6b675d]">
              Total liability: <strong className="text-[#1a1a2e] financial-num ml-1">{formatINR(taxLiability)}</strong>
            </span>
          </div>
          <div className="w-full bg-[#f4ebd9] h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#d97706] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${taxProgress}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-[#8c8577]">{taxProgress.toFixed(0)}% of total liability paid — ₹42,500 balance due Jun 15, 2025</p>
        </div>
      </motion.div>

      {/* Chart + Tax snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-[#e8e2d5] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e]">Income Flow</h2>
            <span className="text-xs font-medium text-[#8c8577]">FY {user.fy}</span>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyIncome}
                margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                onMouseMove={(s) => {
                  if (typeof s.activeTooltipIndex === "number") setActiveIdx(s.activeTooltipIndex);
                }}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8c8577", fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8c8577", fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  cursor={false}
                  contentStyle={{ backgroundColor: "#1a1a2e", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff", fontWeight: 600 }}
                  formatter={(v: number) => [formatINR(v), "Income"]}
                  labelStyle={{ color: "#a3a3a3", marginBottom: "2px", fontSize: "11px" }}
                />
                <Bar dataKey="income" maxBarSize={34} radius={[3, 3, 0, 0]}>
                  {monthlyIncome.map((_, i) => (
                    <Cell key={i} fill="#d97706" fillOpacity={activeIdx === null || activeIdx === i ? 1 : 0.35} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tax snapshot */}
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6">
          <h2 className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e] mb-5">Tax Snapshot</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Gross Income", val: formatINR(taxBreakdown.grossIncome), color: "text-[#1a1a2e]" },
              { label: "44ADA Deduction", val: `−${formatINR(taxBreakdown.deduction44ADA)}`, color: "text-[#b45309]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-semibold financial-num ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5]" />
            {[
              { label: "Net Taxable", val: formatINR(taxBreakdown.netTaxable), color: "text-[#1a1a2e]" },
              { label: "Tax Liability", val: formatINR(taxBreakdown.totalTax), color: "text-[#1a1a2e]" },
              { label: "Advance Paid", val: `−${formatINR(taxBreakdown.advanceTaxPaid)}`, color: "text-[#0369a1]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-semibold financial-num ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5]" />
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#f4ebd9]/50 border-l-2 border-[#d97706]">
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Balance Due</span>
              <span className="text-base font-bold text-[#1a1a2e] financial-num">{formatINR(taxBreakdown.remainingTax)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent uploads table */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#8c8577]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e]">Recent Uploaded Statements</h2>
        </div>
        <div className="rounded-2xl border border-[#e8e2d5] overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#e8e2d5] bg-[#fdfbf7]">
                <th className="py-3 px-5 font-semibold text-[#8c8577] text-xs uppercase tracking-wider">File Name</th>
                <th className="py-3 px-5 font-semibold text-[#8c8577] text-xs uppercase tracking-wider">Platform</th>
                <th className="py-3 px-5 font-semibold text-[#8c8577] text-xs uppercase tracking-wider">Parsed On</th>
                <th className="py-3 px-5 font-semibold text-[#8c8577] text-xs uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUploads.map((doc, i) => (
                <tr key={i} className="border-b border-[#e8e2d5]/60 last:border-0 hover:bg-[#fdfbf7] transition-colors">
                  <td className="py-3.5 px-5 text-[#1a1a2e] font-medium flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                    {doc.file}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-xs font-semibold border border-[#e8e2d5] text-[#6b675d] px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-transparent">
                      {doc.platform}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#8c8577] font-medium">{doc.date}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="text-xs font-bold bg-[#f4ebd9]/60 text-[#d97706] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
