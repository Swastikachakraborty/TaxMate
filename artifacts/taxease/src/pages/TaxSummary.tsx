import { motion } from "framer-motion";
import { FileText, Calendar, TrendingUp, IndianRupee } from "lucide-react";

const TAX_SLABS = [
  { range: "₹0 – ₹3,00,000", rate: "0%", taxable: "₹3,00,000", tax: "₹0" },
  { range: "₹3,00,001 – ₹7,00,000", rate: "5%", taxable: "₹1,20,000", tax: "₹6,000" },
  { range: "₹7,00,001 – ₹10,00,000", rate: "10%", taxable: "₹0", tax: "₹0" },
  { range: "₹10,00,001 – ₹12,00,000", rate: "15%", taxable: "₹0", tax: "₹0" },
  { range: "₹12,00,001 – ₹15,00,000", rate: "20%", taxable: "₹0", tax: "₹0" },
  { range: "Above ₹15,00,000", rate: "30%", taxable: "₹0", tax: "₹0" },
];

const ADVANCE_TAX = [
  { installment: "1st Installment", dueDate: "Jun 15, 2025", percent: "25%", amount: "₹21,125", status: "Due" },
  { installment: "2nd Installment", dueDate: "Sep 15, 2025", percent: "50%", amount: "₹21,125", status: "Upcoming" },
  { installment: "3rd Installment", dueDate: "Dec 15, 2025", percent: "75%", amount: "₹21,125", status: "Upcoming" },
  { installment: "4th Installment", dueDate: "Mar 15, 2026", percent: "100%", amount: "₹21,125", status: "Upcoming" },
];

function TaxArc({ percentage }: { percentage: number }) {
  const radius = 80;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const filled = circumference * (percentage / 100);
  const gap = circumference - filled;
  const cx = 110;
  const cy = 110;

  return (
    <svg width="220" height="130" viewBox="0 0 220 130">
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="#e8e2d5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="#d97706"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
      />
      <text x={cx} y={cy - 18} textAnchor="middle" fill="#1a1a2e" fontSize="28" fontWeight="700" fontFamily="'Playfair Display', serif">
        {percentage}%
      </text>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#8c8577" fontSize="12" fontFamily="Inter, sans-serif">
        of income as tax
      </text>
    </svg>
  );
}

export default function TaxSummary() {
  const BREAKDOWN = [
    { label: "Gross Income", value: "₹8,40,000", icon: TrendingUp, sub: "Upwork + Swiggy + Bank Interest", accent: "#d97706" },
    { label: "Standard Deduction (44ADA)", value: "₹4,20,000", icon: IndianRupee, sub: "50% of gross receipts", accent: "#1a1a2e" },
    { label: "Net Taxable Income", value: "₹4,20,000", icon: IndianRupee, sub: "After 44ADA presumptive deduction", accent: "#059669" },
    { label: "Total Tax + Cess", value: "₹84,500", icon: FileText, sub: "Including 4% health & education cess", accent: "#b45309" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024–2025</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">Tax Summary</h1>
          <p className="text-[#6b675d]">Your complete tax picture — New Tax Regime</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8e2d5] bg-[#fdfbf7] text-sm font-medium text-[#1a1a2e]">
          <FileText className="w-4 h-4 text-[#d97706]" />
          You likely need ITR-4
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#e8e2d5] bg-transparent flex flex-col items-center py-8 px-4">
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-4">Live Tax Liability</p>
          <TaxArc percentage={10} />
          <p className="mt-4 font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e]">₹84,500</p>
          <p className="text-sm text-[#8c8577] mt-1">Total Tax Payable</p>
        </div>

        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BREAKDOWN.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-[#e8e2d5] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-[#f4ebd9]/50" style={{ color: item.accent }}>
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-[#6b675d]">{item.label}</p>
              </div>
              <p className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a2e]">{item.value}</p>
              <p className="text-xs text-[#8c8577] mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e2d5] p-6">
        <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e] mb-5">Tax Slab Breakdown (New Regime FY 2024–25)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="tax-slabs-table">
            <thead>
              <tr className="border-b border-[#e8e2d5]">
                <th className="text-left py-2 pr-4 font-medium text-[#8c8577]">Income Slab</th>
                <th className="text-left py-2 pr-4 font-medium text-[#8c8577]">Rate</th>
                <th className="text-right py-2 pr-4 font-medium text-[#8c8577]">Taxable Amount</th>
                <th className="text-right py-2 font-medium text-[#8c8577]">Tax</th>
              </tr>
            </thead>
            <tbody>
              {TAX_SLABS.map((slab, i) => (
                <tr key={i} className="border-b border-[#e8e2d5]/60 last:border-0">
                  <td className="py-3 pr-4 text-[#1a1a2e]">{slab.range}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-semibold ${slab.rate === "0%" ? "text-[#8c8577]" : "text-[#d97706]"}`}>
                      {slab.rate}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right text-[#1a1a2e] font-mono">{slab.taxable}</td>
                  <td className="py-3 text-right font-mono font-semibold text-[#1a1a2e]">{slab.tax}</td>
                </tr>
              ))}
              <tr className="bg-[#f4ebd9]/40">
                <td colSpan={3} className="py-3 pr-4 font-semibold text-[#1a1a2e]">Total Tax + 4% Cess</td>
                <td className="py-3 text-right font-bold text-[#d97706] font-mono text-base">₹84,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e2d5] p-6">
        <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e] mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#d97706]" />
          Advance Tax Installments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVANCE_TAX.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`p-4 rounded-xl border transition-colors relative overflow-hidden ${
                item.status === "Due"
                  ? "border-[#d97706]/40 bg-[#fdf8ee]"
                  : "border-[#e8e2d5] bg-transparent"
              }`}
              data-testid={`advance-tax-${i}`}
            >
              {item.status === "Due" && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d97706]" />
              )}
              <p className="text-xs font-medium text-[#8c8577] mb-1">{item.installment}</p>
              <p className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a2e]">{item.amount}</p>
              <p className="text-xs text-[#8c8577] mt-1">{item.dueDate}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-[#8c8577]">{item.percent} of annual</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  item.status === "Due"
                    ? "bg-[#d97706]/15 text-[#b46204]"
                    : "bg-[#f4ebd9]/60 text-[#8c8577]"
                }`}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
