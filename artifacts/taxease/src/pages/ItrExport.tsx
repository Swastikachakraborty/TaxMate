import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, FileText, Printer, Share2, RefreshCw, AlertCircle } from "lucide-react";
import { itrExportData, formatINR } from "@/lib/data";

export default function ItrExport() {
  const [showPreview, setShowPreview] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success">("idle");

  function handleGenerate() {
    setShowPreview(true);
  }

  function handleDownload() {
    setDownloadState("loading");
    setTimeout(() => {
      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 3000);
    }, 1800);
  }

  const INCOME_ROWS = [
    { source: "Upwork Freelance Contracts", amount: formatINR(520000) },
    { source: "Swiggy Logistics Partner", amount: formatINR(210000) },
    { source: "Bank Statement Interests", amount: formatINR(10000) },
    { source: "Total Gross Receipts", amount: formatINR(840000), bold: true },
    { source: "Less: 44ADA Deduction (50%)", amount: `−${formatINR(420000)}`, muted: true },
    { source: "Net Taxable Income", amount: formatINR(420000), bold: true },
  ];

  const SUMMARY_FIELDS = [
    { label: "Name", value: itrExportData.name },
    { label: "PAN", value: itrExportData.pan },
    { label: "Assessment Year", value: `AY ${itrExportData.assessmentYear}` },
    { label: "ITR Form", value: itrExportData.formType },
    { label: "Gross Total Income", value: formatINR(itrExportData.grossIncome) },
    { label: "44ADA Deduction", value: formatINR(itrExportData.deduction44ADA) },
    { label: "Net Taxable Income", value: formatINR(itrExportData.netTaxable) },
    { label: "Total Tax Payable", value: formatINR(itrExportData.totalTax) },
    { label: "Advance Tax Paid", value: formatINR(itrExportData.advanceTaxPaid) },
    { label: "Balance Tax Due", value: formatINR(itrExportData.balanceDue) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8"
    >
      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Filing</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">ITR Export</h1>
        <p className="text-[#6b675d]">Generate and download your tax worksheet for filing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary + actions panel */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#1a1a2e]">Summary</h3>
            <div className="space-y-0">
              {SUMMARY_FIELDS.map((f) => (
                <div key={f.label} className="flex justify-between items-center py-2 border-b border-[#e8e2d5]/60 last:border-0">
                  <span className="text-xs text-[#6b675d]">{f.label}</span>
                  <span className="text-xs font-semibold text-[#1a1a2e] financial-num">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGenerate}
              data-testid="generate-pdf-button"
              className="w-full h-11 rounded-xl border border-[#d97706] text-[#d97706] hover:bg-[#f4ebd9]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showPreview ? "Regenerate Worksheet" : "Compile Worksheet"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors">
                <Printer className="w-3.5 h-3.5" />Print
              </button>
              <button className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors">
                <Share2 className="w-3.5 h-3.5" />Share
              </button>
            </div>
          </div>

          <div className="flex gap-3 bg-[#eff6ff]/60 border border-blue-100 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-[#6b675d] leading-relaxed">Verify computed fields before entry onto the income tax portal. Consult a CA for official filing.</p>
          </div>
        </div>

        {/* Worksheet preview */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577]">
            {showPreview ? "Worksheet Preview" : "PDF Preview"}
          </p>

          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div
                key="worksheet"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(26,26,46,0.08)] border border-[#e8e2d5] font-sans"
                data-testid="worksheet-preview"
              >
                {/* Worksheet header */}
                <div className="flex items-center justify-between border-b-2 border-[#1a1a2e] px-8 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm bg-[#1a1a2e] text-white px-2 py-0.5 rounded">TE</span>
                    <span className="font-['Playfair_Display'] font-bold text-lg text-[#1a1a2e]">TaxEase Worksheet</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Assessment Year</p>
                    <p className="text-xs font-extrabold text-[#1a1a2e]">AY {itrExportData.assessmentYear}</p>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* Taxpayer details */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 text-xs">
                    {[
                      { label: "Assessee Name", value: itrExportData.name },
                      { label: "PAN ID", value: itrExportData.pan },
                      { label: "ITR Form", value: itrExportData.formType },
                      { label: "Tax Regime", value: "New Tax Regime" },
                    ].map((f) => (
                      <div key={f.label}>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{f.label}</span>
                        <p className="font-bold text-[#1a1a2e]">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Income breakdown table */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">1. Gross Business Receipts</p>
                    <table className="w-full text-xs border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50 font-bold text-gray-600">
                          <th className="p-2 border border-gray-200 text-left">Source Platform / Stream</th>
                          <th className="p-2 border border-gray-200 text-right">Gross Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INCOME_ROWS.map((row, i) => (
                          <tr key={i} className={`${row.bold ? "bg-[#fdf8ee] font-bold" : ""} border-b border-gray-100 last:border-0`}>
                            <td className={`p-2 ${row.muted ? "text-gray-400" : "text-[#1a1a2e]"}`}>{row.source}</td>
                            <td className={`p-2 text-right financial-num ${row.muted ? "text-gray-400" : "text-[#1a1a2e]"}`}>{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tax computation */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">2. Tax Computation Summary</p>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: "Gross Base Receipts", val: formatINR(itrExportData.grossIncome), style: "text-[#1a1a2e] font-semibold" },
                        { label: "Less: 44ADA 50% Deduction", val: `−${formatINR(itrExportData.deduction44ADA)}`, style: "text-gray-400" },
                        { label: "Net Taxable Base", val: formatINR(itrExportData.netTaxable), style: "text-[#1a1a2e] font-bold border-t border-gray-200 pt-1.5 mt-1" },
                        { label: "Tax Dues", val: formatINR(itrExportData.totalTax), style: "text-[#1a1a2e] font-semibold" },
                        { label: "Less: Advance Taxes Paid", val: `−${formatINR(itrExportData.advanceTaxPaid)}`, style: "text-blue-500" },
                        { label: "NET BALANCE DUE", val: formatINR(itrExportData.balanceDue), style: "text-red-600 font-black border-t border-gray-300 pt-1.5 mt-1" },
                      ].map((r) => (
                        <div key={r.label} className={`flex justify-between ${r.style}`}>
                          <span>{r.label}</span>
                          <span className="financial-num">{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-gray-400 text-center border-t border-gray-100 pt-4">
                    Generated by TaxEase · This worksheet is a summary computation and does not represent an official ITR-4 filing.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(26,26,46,0.08)] border border-[#e8e2d5]"
                data-testid="pdf-preview"
              >
                <div className="bg-[#1a1a2e] px-8 py-5 flex items-center justify-between">
                  <div>
                    <p className="font-['Playfair_Display'] text-white font-bold text-xl leading-none">TaxEase.</p>
                    <p className="text-white/50 text-xs mt-1">Tax Summary Report</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">AY {itrExportData.assessmentYear}</p>
                    <p className="text-white/50 text-xs">FY 2024–25</p>
                  </div>
                </div>
                <div className="px-8 py-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#f0ebe2]">
                    {[
                      { label: "Taxpayer Name", value: itrExportData.name },
                      { label: "PAN", value: itrExportData.pan },
                      { label: "ITR Form", value: itrExportData.formType },
                      { label: "Tax Regime", value: "New Tax Regime" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-xs text-[#8c8577] uppercase tracking-wide mb-1">{f.label}</p>
                        <p className="text-[#1a1a2e] font-semibold text-sm">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#fdf8ee] rounded-xl p-4 flex items-center justify-between border border-[#d97706]/20">
                    <div>
                      <p className="text-xs text-[#8c8577] mb-1">Total Tax Payable</p>
                      <p className="font-['Playfair_Display'] text-2xl font-bold text-[#d97706] financial-num">{formatINR(itrExportData.totalTax)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#8c8577] mb-1">Balance Due</p>
                      <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] financial-num">{formatINR(itrExportData.balanceDue)}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#8c8577] text-center border-t border-[#f0ebe2] pt-4">
                    Generated by TaxEase · For informational purposes only · Consult a CA for filing
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showPreview && (
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                data-testid="download-button"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white text-sm font-medium transition-colors"
              >
                {downloadState === "loading" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</>
                ) : downloadState === "success" ? (
                  <><CheckCircle2 className="w-4 h-4" />Ready to Download</>
                ) : (
                  <><Download className="w-4 h-4" />Download PDF</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
