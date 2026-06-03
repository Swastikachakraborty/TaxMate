import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";
import { taxBreakdown, advanceTaxSchedule, totalIncome, taxLiability, advanceTaxPaid, user, formatINR } from "@/lib/data";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function TaxArc({ percentage }: { percentage: number }) {
  const r = 80, sw = 10;
  const circ = Math.PI * r;
  const filled = circ * (percentage / 100);
  const cx = 110, cy = 110;
  return (
    <svg width="220" height="125" viewBox="0 0 220 125">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e8e2d5" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#d97706" strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${filled} ${circ - filled}`} />
      <text x={cx} y={cy - 16} textAnchor="middle" fill="#1a1a2e" fontSize="26" fontWeight="700" fontFamily="'Playfair Display', serif">{percentage}%</text>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#8c8577" fontSize="11" fontFamily="Inter, sans-serif">of income as tax</text>
    </svg>
  );
}

export default function TaxSummary() {
  const taxProgressPercent = (advanceTaxPaid / taxLiability) * 100;

  // Stacked bar: net taxable = 4,20,000 out of 8,40,000
  // Of net taxable (4,20,000): 0-3L (71.4%) is nil, 3L-4.2L (28.6%) is at 5%
  const slabSegments = [
    { label: "₹0–3L (Nil)", widthPct: 71.4, color: "bg-[#e8e2d5]" },
    { label: "₹3–4.2L @ 5%", widthPct: 28.6, color: "bg-[#d97706]" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
        <div>
          <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Filing Assessments</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e]">Tax Summary — FY {user.fy}</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8e2d5] bg-[#fdfbf7] text-sm font-medium text-[#1a1a2e] shrink-0">
          <FileText className="w-4 h-4 text-[#d97706]" />
          ITR-4 Recommended
        </div>
      </motion.div>

      {/* Arc + computation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] flex flex-col items-center py-8 px-4">
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-4">Live Tax Liability</p>
          <TaxArc percentage={10} />
          <p className="mt-4 font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e]">{formatINR(taxLiability)}</p>
          <p className="text-sm text-[#8c8577] mt-1">Total Tax Payable</p>
          {/* Progress bar */}
          <div className="w-full mt-6 space-y-1.5 px-2">
            <div className="flex justify-between text-xs font-semibold text-[#6b675d]">
              <span>Advance paid</span>
              <span className="financial-num">{formatINR(advanceTaxPaid)}</span>
            </div>
            <div className="w-full bg-[#f4ebd9] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#d97706] h-full rounded-full" style={{ width: `${taxProgressPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[#8c8577]">
              <span>{taxProgressPercent.toFixed(0)}% paid</span>
              <span className="financial-num">Balance: {formatINR(taxBreakdown.remainingTax)}</span>
            </div>
          </div>
        </motion.div>

        {/* Income computation */}
        <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577] border-b border-[#e8e2d5] pb-3">Income Computation</p>
          <div className="space-y-3 text-sm font-medium">
            {[
              { label: "Gross Income Receipts", val: formatINR(totalIncome), color: "text-[#1a1a2e]" },
              { label: "Section 44ADA Deduction (50%)", val: `−${formatINR(taxBreakdown.deduction44ADA)}`, color: "text-[#b45309]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-bold financial-num ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5]" />
            {[
              { label: "Net Taxable Base", val: formatINR(taxBreakdown.netTaxable), color: "text-[#1a1a2e]" },
              { label: "Tax Liability", val: formatINR(taxLiability), color: "text-[#1a1a2e]" },
              { label: "Advance Tax Paid", val: `−${formatINR(advanceTaxPaid)}`, color: "text-[#0369a1]" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={`font-bold financial-num ${r.color}`}>{r.val}</span>
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

      {/* Advance tax schedule */}
      <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-5">
        <p className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#d97706]" />
          Advance Tax Schedule
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" data-testid="advance-tax-table">
            <thead>
              <tr className="border-b border-[#e8e2d5] text-[#8c8577] font-semibold text-xs uppercase tracking-wider">
                <th className="py-2.5 pr-4">Installment</th>
                <th className="py-2.5 pr-4">Due Date</th>
                <th className="py-2.5 pr-4">Cumulative %</th>
                <th className="py-2.5 pr-4 financial-num">Amount</th>
                <th className="py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {advanceTaxSchedule.map((inst, i) => (
                <tr key={i} className="border-b border-[#e8e2d5]/60 last:border-0" data-testid={`advance-tax-${i}`}>
                  <td className="py-3 pr-4 text-[#6b675d] font-medium">{["1st","2nd","3rd","4th"][i]}</td>
                  <td className="py-3 pr-4 text-[#1a1a2e] font-medium">{inst.date.split(",")[0]}</td>
                  <td className="py-3 pr-4 text-[#1a1a2e] font-semibold">{inst.percent}</td>
                  <td className="py-3 pr-4 font-bold financial-num text-[#1a1a2e]">{formatINR(inst.amount)}</td>
                  <td className="py-3 text-right">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      inst.status === "Due"
                        ? "bg-[#d97706]/15 text-[#b46204]"
                        : "bg-[#f4ebd9]/60 text-[#8c8577]"
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Stacked slab bar */}
      <motion.div variants={item} className="rounded-2xl border border-[#e8e2d5] p-6 space-y-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577]">Taxable Slab Segmentation</p>
        <div className="space-y-3">
          <div className="flex w-full h-4 rounded-full overflow-hidden">
            {slabSegments.map((seg, i) => (
              <div key={i} className={`${seg.color} h-full transition-all`} style={{ width: `${seg.widthPct}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs font-semibold text-[#6b675d]">
            {slabSegments.map((seg, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded ${i === 0 ? "bg-[#e8e2d5]" : "bg-[#d97706]"}`} />
                {seg.label} ({seg.widthPct}%)
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
