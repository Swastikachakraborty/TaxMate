import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, FileText, Printer, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">ITR Export</h1>
        <p className="text-muted-foreground">Generate and download your tax summary for filing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Summary</h3>
            <div className="space-y-3">
              {SUMMARY_FIELDS.map((field) => (
                <div key={field.label} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{field.label}</span>
                  <span className="text-sm font-medium text-white font-mono">{field.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                data-testid="generate-pdf-button"
                className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 text-white border-0 shadow-lg shadow-primary/20 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {downloading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Generating PDF...
                    </motion.div>
                  ) : downloaded ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Downloaded!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Generate PDF Summary
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-xs gap-1.5 border-border text-muted-foreground hover:text-white">
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </Button>
                <Button variant="outline" className="text-xs gap-1.5 border-border text-muted-foreground hover:text-white">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 lg:col-span-2">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">PDF Preview</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl"
            data-testid="pdf-preview"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">TaxEase</p>
                  <p className="text-orange-100 text-xs mt-0.5">Tax Summary Report</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-sm">AY 2025–26</p>
                <p className="text-orange-100 text-xs">FY 2024–25</p>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Taxpayer Name</p>
                  <p className="text-gray-900 font-semibold">Priya Sharma</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">PAN</p>
                  <p className="text-gray-900 font-semibold font-mono">ABCPS1234F</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">ITR Form</p>
                  <p className="text-gray-900 font-semibold">ITR-4 (Presumptive Income)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tax Regime</p>
                  <p className="text-gray-900 font-semibold">New Tax Regime</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Income Breakdown</p>
                <table className="w-full text-sm">
                  <tbody>
                    {INCOME_ROWS.map((row, i) => (
                      <tr key={i} className={`border-b border-gray-100 last:border-0 ${row.bold ? "bg-orange-50" : ""}`}>
                        <td className={`py-2 ${row.bold ? "font-bold text-gray-900" : "text-gray-600"}`}>
                          {row.source}
                        </td>
                        <td className={`py-2 text-right font-mono ${row.bold ? "font-bold text-gray-900" : row.muted ? "text-gray-400" : "text-gray-700"}`}>
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Tax Payable</p>
                  <p className="text-2xl font-bold text-orange-600">₹84,500</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Balance Due</p>
                  <p className="text-2xl font-bold text-gray-900">₹42,500</p>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 text-center border-t border-gray-100 pt-4">
                Generated by TaxEase · For informational purposes only · Consult a CA for filing
              </p>
            </div>
          </motion.div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleDownload}
              data-testid="download-button"
              className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
