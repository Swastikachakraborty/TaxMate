import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, FileText, Printer, Share2 } from "lucide-react";

const SUMMARY_FIELDS = [
  { label: "Name", value: "Priya Sharma" },
  { label: "PAN", value: "ABCPS1234F" },
  { label: "Assessment Year", value: "AY 2025–26" },
  { label: "ITR Form", value: "ITR-4" },
  { label: "Gross Total Income", value: "₹8,40,000" },
  { label: "Presumptive Income (44ADA)", value: "₹4,20,000" },
  { label: "Net Taxable Income", value: "₹4,20,000" },
  { label: "Total Tax Payable", value: "₹84,500" },
  { label: "Advance Tax Paid", value: "₹42,000" },
  { label: "Balance Tax Due", value: "₹42,500" },
];

const INCOME_ROWS = [
  { source: "Upwork (Professional Income)", amount: "₹5,20,000" },
  { source: "Swiggy (Business Income)", amount: "₹2,10,000" },
  { source: "Bank Interest", amount: "₹10,000" },
  { source: "Total Gross Income", amount: "₹8,40,000", bold: true },
  { source: "Less: 44ADA Deduction (50%)", amount: "(₹4,20,000)", muted: true },
  { source: "Net Taxable Income", amount: "₹4,20,000", bold: true },
];

export default function ItrExport() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024–2025</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">ITR Export</h1>
        <p className="text-[#6b675d]">Generate and download your tax summary for filing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
          <h3 className="text-base font-semibold text-[#1a1a2e]">Summary</h3>
          <div className="space-y-0">
            {SUMMARY_FIELDS.map((field) => (
              <div key={field.label} className="flex justify-between items-center py-2 border-b border-[#e8e2d5]/60 last:border-0">
                <span className="text-sm text-[#6b675d]">{field.label}</span>
                <span className="text-sm font-medium text-[#1a1a2e] font-mono">{field.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              data-testid="generate-pdf-button"
              className="w-full h-12 rounded-2xl bg-[#d97706] hover:bg-[#b46204] disabled:opacity-60 text-white text-sm font-semibold transition-all relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {downloading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    Generating PDF...
                  </motion.div>
                ) : downloaded ? (
                  <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Downloaded!
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generate PDF Summary
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors">
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider mb-3">PDF Preview</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(26,26,46,0.08)] border border-[#e8e2d5]"
            data-testid="pdf-preview"
          >
            <div className="bg-[#1a1a2e] px-8 py-5 flex items-center justify-between">
              <div>
                <p className="font-['Playfair_Display'] text-white font-bold text-xl leading-none">TaxEase.</p>
                <p className="text-white/50 text-xs mt-1">Tax Summary Report</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-sm">AY 2025–26</p>
                <p className="text-white/50 text-xs">FY 2024–25</p>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#f0ebe2]">
                {[
                  { label: "Taxpayer Name", value: "Priya Sharma" },
                  { label: "PAN", value: "ABCPS1234F" },
                  { label: "ITR Form", value: "ITR-4 (Presumptive Income)" },
                  { label: "Tax Regime", value: "New Tax Regime" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-[#8c8577] uppercase tracking-wide mb-1">{f.label}</p>
                    <p className="text-[#1a1a2e] font-semibold text-sm">{f.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-[#8c8577] uppercase tracking-wide mb-3">Income Breakdown</p>
                <table className="w-full text-sm">
                  <tbody>
                    {INCOME_ROWS.map((row, i) => (
                      <tr key={i} className={`border-b border-[#f0ebe2] last:border-0 ${row.bold ? "bg-[#fdf8ee]" : ""}`}>
                        <td className={`py-2 ${row.bold ? "font-bold text-[#1a1a2e]" : "text-[#6b675d]"}`}>{row.source}</td>
                        <td className={`py-2 text-right font-mono ${row.bold ? "font-bold text-[#1a1a2e]" : row.muted ? "text-[#8c8577]" : "text-[#1a1a2e]"}`}>
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#fdf8ee] rounded-xl p-4 flex items-center justify-between border border-[#d97706]/20">
                <div>
                  <p className="text-xs text-[#8c8577] mb-1">Total Tax Payable</p>
                  <p className="font-['Playfair_Display'] text-2xl font-bold text-[#d97706]">₹84,500</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8c8577] mb-1">Balance Due</p>
                  <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e]">₹42,500</p>
                </div>
              </div>

              <p className="text-[10px] text-[#8c8577] text-center border-t border-[#f0ebe2] pt-4">
                Generated by TaxEase · For informational purposes only · Consult a CA for filing
              </p>
            </div>
          </motion.div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDownload}
              data-testid="download-button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
