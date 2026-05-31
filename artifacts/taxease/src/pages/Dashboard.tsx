import { motion } from "framer-motion";
import { FileText, ArrowRight, Upload, Calendar, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const chartData = [
  { month: "Apr", amount: 65000 },
  { month: "May", amount: 72000 },
  { month: "Jun", amount: 58000 },
  { month: "Jul", amount: 80000 },
  { month: "Aug", amount: 91000 },
  { month: "Sep", amount: 63000 },
  { month: "Oct", amount: 55000 },
  { month: "Nov", amount: 78000 },
  { month: "Dec", amount: 84000 },
  { month: "Jan", amount: 70000 },
  { month: "Feb", amount: 62000 },
  { month: "Mar", amount: 62000 },
];

const HIGHLIGHT_MONTHS = [4, 7, 11]; // Aug, Nov, Dec (0-indexed)

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-10"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024–2025</p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight leading-tight">
            Priya's Annual Summary
          </h1>
          <p className="text-[#6b675d] mt-3 max-w-xl leading-relaxed text-base">
            Freelance designer & Swiggy delivery partner. Your tax liability has been calculated based on your recent document uploads.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            data-testid="button-download"
            className="h-11 px-6 rounded-full border border-[#1a1a2e] text-[#1a1a2e] text-sm font-medium bg-transparent hover:bg-[#1a1a2e] hover:text-white transition-all"
          >
            Download Report
          </button>
          <button
            data-testid="button-pay"
            className="h-11 px-6 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white text-sm font-medium transition-all shadow-sm"
          >
            Pay Balance
          </button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Income */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[#e8e2d5] bg-transparent p-6"
          data-testid="card-total-income"
        >
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-3">Total Income</p>
          <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e] mb-3">₹8,40,000</div>
          <div className="border-t border-[#e8e2d5]/60 pt-3 space-y-1.5 text-sm text-[#8c8577]">
            <div className="flex justify-between"><span>Upwork</span><span className="font-medium">₹5,20,000</span></div>
            <div className="flex justify-between"><span>Swiggy</span><span className="font-medium">₹2,10,000</span></div>
            <div className="flex justify-between"><span>Interest</span><span className="font-medium">₹10,000</span></div>
          </div>
        </motion.div>

        {/* Tax Liability */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[#e8e2d5] bg-transparent p-6"
          data-testid="card-tax-liability"
        >
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-3">Tax Liability</p>
          <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e] mb-3">₹84,500</div>
          <div className="border-t border-[#e8e2d5]/60 pt-3 text-sm text-[#8c8577]">Calculated under new regime</div>
        </motion.div>

        {/* Advance Paid */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          className="rounded-2xl border border-[#e8e2d5] bg-transparent p-6"
          data-testid="card-advance-paid"
        >
          <p className="text-xs font-semibold text-[#6b675d] uppercase tracking-wider mb-3">Advance Paid</p>
          <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e] mb-3">₹42,000</div>
          <div className="border-t border-[#e8e2d5]/60 pt-3 text-sm text-[#8c8577]">Via TDS & self-assessment</div>
        </motion.div>

        {/* Balance Due — highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-2xl border border-[#d97706]/30 bg-[#fcfaf7] p-6 relative overflow-hidden"
          data-testid="card-balance-due"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#d97706]" />
          <p className="text-xs font-semibold text-[#d97706] uppercase tracking-wider mb-3">Balance Due</p>
          <div className="font-['Playfair_Display'] text-4xl font-bold text-[#1a1a2e] mb-3">₹42,500</div>
          <div className="border-t border-[#d97706]/20 pt-3 flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e]">
            <Calendar className="h-3.5 w-3.5 text-[#d97706]" />
            Due Jun 15, 2025
          </div>
        </motion.div>
      </div>

      {/* Chart + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income Flow chart */}
        <div className="lg:col-span-2">
          <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a2e] mb-5">Income Flow</h2>
          <div className="rounded-2xl border border-[#e8e2d5] p-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8c8577", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8c8577", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f4ebd9", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 600 }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Income"]}
                  labelStyle={{ color: "#a3a3a3", marginBottom: "4px" }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={38}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={HIGHLIGHT_MONTHS.includes(i) ? "#d97706" : "#e2d3b6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a2e]">Recent Documents</h2>
            <button
              data-testid="button-upload"
              className="flex items-center gap-1 text-sm font-medium text-[#d97706] hover:text-[#b46204] transition-colors"
            >
              Upload <Upload className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Upwork_April_2025.pdf", type: "Income", date: "2 days ago" },
              { name: "Swiggy_March_2025.pdf", type: "Income", date: "1 week ago" },
              { name: "Bank_Statement_Q4.pdf", type: "Statement", date: "2 weeks ago" },
            ].map((doc, i) => (
              <div
                key={i}
                data-testid={`doc-row-${i}`}
                className="group p-4 rounded-xl border border-[#e8e2d5] hover:bg-[#fdfbf7] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#f4ebd9]/50 rounded-lg text-[#d97706]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e] mb-1 group-hover:text-[#d97706] transition-colors truncate max-w-[140px]">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#8c8577]">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#d97706]" />
                        Parsed
                      </span>
                      <span>·</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8c8577] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}

            <button
              data-testid="button-view-all-docs"
              className="w-full mt-1 h-11 rounded-xl border border-[#e8e2d5] text-sm font-medium text-[#1a1a2e] hover:bg-[#f4ebd9]/30 transition-colors"
            >
              View all documents
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
