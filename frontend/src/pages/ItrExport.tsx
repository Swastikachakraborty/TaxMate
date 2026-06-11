import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, FileText, Printer, RefreshCw, AlertCircle, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { api, type ItrSummary } from "@/lib/api";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-[#f4ebd9]/50 rounded-xl animate-pulse ${className}`} />;
}

// Sample data for demo/offline mode
const DEMO_ITR: ItrSummary = {
  user_id: "demo",
  form_type: "ITR-4 (Sugam)",
  assessment_year: "2026-27",
  personal_info: { name: "Priya Sharma", pan_number: "ABCDE1234F", state: "Maharashtra" },
  income_computation: {
    gross_receipts: 840000,
    deduction_44ada: 420000,
    net_taxable: 420000,
  },
  tax_computation: {
    total_tax: 10400,
    tds_credit: 4200,
    advance_tax_paid: 1560,
    net_payable: 4640,
  },
  platform_income: {
    upwork: 520000,
    swiggy: 210000,
    bank_interest: 110000,
  },
};

export default function ItrExport() {
  const { userId, name } = useAuth();
  const uid = userId ?? "demo_user";

  const [showPreview, setShowPreview] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success">("idle");

  const itr = useQuery<ItrSummary>({
    queryKey: ["itr", uid],
    queryFn: () => api.getItr(uid),
    enabled: !!uid,
    retry: false,
  });

  function handleDownload() {
    setDownloadState("loading");
    setTimeout(() => {
      window.print();
      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 3000);
    }, 800);
  }

  if (itr.isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 space-y-6">
        <SkeletonBlock className="h-12 w-64" />
        <div className="grid grid-cols-3 gap-6">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="col-span-2 h-80" />
        </div>
      </div>
    );
  }

  const isDemo = !itr.data || !!itr.error;
  const d = isDemo ? DEMO_ITR : itr.data!;
  const ic = d.income_computation;
  const tc = d.tax_computation;
  const pi = d.personal_info;

  const SUMMARY_FIELDS = [
    { label: "Name", value: pi.name || name || "—" },
    { label: "PAN", value: pi.pan_number || "Not provided" },
    { label: "Assessment Year", value: `AY ${d.assessment_year}` },
    { label: "ITR Form", value: d.form_type },
    { label: "Gross Total Earnings (कुल आय)", value: formatINR(ic.gross_receipts) },
    { label: "44ADA Deduction (50%)", value: formatINR(ic.deduction_44ada) },
    { label: "Net Taxable Income (कर योग्य)", value: formatINR(ic.net_taxable) },
    { label: "Total Tax Payable", value: formatINR(tc.total_tax) },
    { label: "TDS Deducted (TDS)", value: formatINR(tc.tds_credit) },
    { label: "Balance Tax Due (बकाया)", value: formatINR(tc.net_payable) },
  ];

  const INCOME_ROWS = [
    ...(d.platform_income
      ? Object.entries(d.platform_income).map(([src, amt]) => ({
          source: `${src.charAt(0).toUpperCase() + src.slice(1)} Earnings`,
          amount: formatINR(amt as number),
        }))
      : []),
    { source: "Total Gross Receipts", amount: formatINR(ic.gross_receipts), bold: true },
    { source: "Less: 44ADA Deduction (50%)", amount: `−${formatINR(ic.deduction_44ada)}`, muted: true },
    { source: "Net Taxable Income", amount: formatINR(ic.net_taxable), bold: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20 md:pb-10 space-y-8 overflow-y-auto h-full"
    >
      {/* Demo banner */}
      {isDemo && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">यह Sample ITR Worksheet है</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Real data देखने के लिए backend चालू करें और income PDFs upload करें।{" "}
              <Link href="/app/upload"><span className="underline font-semibold cursor-pointer">Upload करें →</span></Link>
            </p>
          </div>
        </div>
      )}

      <header>
        <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">Filing · ITR दाखिल करें</p>
        <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-[#1a1a2e] mb-2">ITR-4 Export</h1>
        <p className="text-[#6b675d]">
          आपकी tax worksheet ready है — यह worksheet अपने CA को दें या खुद ITR-4 file करें
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary panel */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e8e2d5] p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#1a1a2e]">Summary · सारांश</h3>
            <div>
              {SUMMARY_FIELDS.map((f) => (
                <div key={f.label} className="flex justify-between items-center py-2 border-b border-[#e8e2d5]/60 last:border-0">
                  <span className="text-xs text-[#6b675d]">{f.label}</span>
                  <span className="text-xs font-semibold text-[#1a1a2e]">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full h-11 rounded-xl border border-[#d97706] text-[#d97706] hover:bg-[#f4ebd9]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {showPreview ? "Regenerate Worksheet" : "Generate Worksheet"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.print()}
                className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />Print
              </button>
              <button
                onClick={handleDownload}
                className="h-10 rounded-xl border border-[#e8e2d5] text-xs font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                {downloadState === "loading" ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Preparing…</>
                ) : downloadState === "success" ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />Ready!</>
                ) : (
                  <><Download className="w-3.5 h-3.5" />Download</>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 bg-blue-50/60 border border-blue-100 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-[#6b675d] leading-relaxed">
              यह worksheet आपके computed tax का summary है। File करने से पहले Income Tax portal पर figures verify करें। Official filing के लिए CA से सलाह लें।
            </p>
          </div>
        </div>

        {/* Worksheet preview */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8c8577]">
            {showPreview ? "Worksheet Preview" : "Tax Summary Preview"}
          </p>

          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div
                key="worksheet"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(26,26,46,0.08)] border border-[#e8e2d5]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-[#1a1a2e] px-8 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm bg-[#1a1a2e] text-white px-2 py-0.5 rounded">GS</span>
                    <span className="font-['Playfair_Display'] font-bold text-lg text-[#1a1a2e]">GigSaathi Worksheet</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Assessment Year</p>
                    <p className="text-xs font-extrabold text-[#1a1a2e]">AY {d.assessment_year}</p>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* Taxpayer */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100 text-xs">
                    {[
                      { label: "Assessee Name", value: pi.name || name || "—" },
                      { label: "PAN", value: pi.pan_number || "Not provided" },
                      { label: "ITR Form", value: d.form_type },
                      { label: "Tax Regime", value: "New Tax Regime (2025-26)" },
                    ].map((f) => (
                      <div key={f.label}>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{f.label}</span>
                        <p className="font-bold text-[#1a1a2e]">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Income table */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">1. Gross Business Receipts (कुल व्यावसायिक प्राप्तियाँ)</p>
                    <table className="w-full text-xs border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50 font-bold text-gray-600">
                          <th className="p-2 border border-gray-200 text-left">Source / Platform</th>
                          <th className="p-2 border border-gray-200 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INCOME_ROWS.map((row, i) => (
                          <tr key={i} className={`${(row as any).bold ? "bg-[#fdf8ee] font-bold" : ""} border-b border-gray-100 last:border-0`}>
                            <td className={`p-2 ${(row as any).muted ? "text-gray-400" : "text-[#1a1a2e]"}`}>{row.source}</td>
                            <td className={`p-2 text-right ${(row as any).muted ? "text-gray-400" : "text-[#1a1a2e]"}`}>{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tax computation */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">2. Tax Computation (कर गणना)</p>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: "Gross Receipts", val: formatINR(ic.gross_receipts), style: "text-[#1a1a2e] font-semibold" },
                        { label: "Less: 44ADA 50% Deduction", val: `−${formatINR(ic.deduction_44ada)}`, style: "text-gray-400" },
                        { label: "Net Taxable Income", val: formatINR(ic.net_taxable), style: "text-[#1a1a2e] font-bold border-t border-gray-200 pt-1.5 mt-1" },
                        { label: "Tax + 4% Cess", val: formatINR(tc.total_tax), style: "text-[#1a1a2e] font-semibold" },
                        { label: "Less: TDS Deducted at Source", val: `−${formatINR(tc.tds_credit)}`, style: "text-blue-500" },
                        { label: "NET BALANCE DUE (बकाया)", val: formatINR(tc.net_payable), style: "text-red-600 font-black border-t border-gray-300 pt-1.5 mt-1" },
                      ].map((r) => (
                        <div key={r.label} className={`flex justify-between ${r.style}`}>
                          <span>{r.label}</span><span>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-gray-400 text-center border-t border-gray-100 pt-4">
                    Generated by GigSaathi · {isDemo ? "⚠️ SAMPLE DATA — Not actual figures" : "Based on your uploaded income data"} · Consult a CA for official filing
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
              >
                <div className="bg-[#1a1a2e] px-8 py-5 flex items-center justify-between">
                  <div>
                    <p className="font-['Playfair_Display'] text-white font-bold text-xl leading-none">GigSaathi.</p>
                    <p className="text-white/50 text-xs mt-1">ITR-4 Tax Worksheet</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">AY {d.assessment_year}</p>
                    <p className="text-white/50 text-xs">FY 2025–26</p>
                  </div>
                </div>
                <div className="px-8 py-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#f0ebe2]">
                    {[
                      { label: "Taxpayer", value: pi.name || name || "—" },
                      { label: "PAN", value: pi.pan_number || "Not provided" },
                      { label: "ITR Form", value: d.form_type },
                      { label: "Tax Regime", value: "New Regime" },
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
                      <p className="font-['Playfair_Display'] text-2xl font-bold text-[#d97706]">{formatINR(tc.total_tax)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#8c8577] mb-1">Balance Due (बकाया)</p>
                      <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e]">{formatINR(tc.net_payable)}</p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-[#8c8577]">
                    "Generate Worksheet" बटन दबाएं — पूरी ITR-4 breakdown देखें
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showPreview && (
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white text-sm font-medium transition-colors"
              >
                {downloadState === "loading" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />Preparing…</>
                ) : downloadState === "success" ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-400" />Print window खुल रही है…</>
                ) : (
                  <><Download className="w-4 h-4" />Download / Print PDF</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
