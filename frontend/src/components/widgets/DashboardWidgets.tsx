import { motion } from "framer-motion";
import { TrendingUp, Calendar, FileText, UploadCloud, Loader2 } from "lucide-react";
import { IncomeSummary, TaxResult, DeadlinesResult } from "@/lib/api";

const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function StatCard({
  label, value, sub, accent, icon,
}: {
  label: string; value: string; sub?: string; accent?: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#f4ebd9] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#8c8577] uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-lg font-bold leading-none ${accent ?? "text-[#1a1a2e]"}`}>{value}</p>
        {sub && <p className="text-[10px] text-[#8c8577] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function EmptyPanel({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-[#f4ebd9] flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">{title}</p>
        <p className="text-xs text-[#8c8577] max-w-[200px] mt-1">{desc}</p>
      </div>
    </div>
  );
}

interface RightDashboardPaneProps {
  income?: IncomeSummary;
  tax?: TaxResult;
  deadlines?: DeadlinesResult;
  deadlinesLoading: boolean;
}

export function RightDashboardPane({ income, tax, deadlines, deadlinesLoading }: RightDashboardPaneProps) {
  const hasIncome = (income?.record_count ?? 0) > 0;
  const nextDeadline = deadlines?.next_deadline;

  return (
    <div className="hidden lg:flex flex-col flex-1 overflow-y-auto bg-[#faf7f2] p-5 space-y-5">
      
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Gross Earnings"
          value={hasIncome ? INR(income!.total_gross_income) : "—"}
          sub={hasIncome ? `${income!.record_count} transactions · ${Object.keys(income!.platform_breakdown).length} platforms` : "No data yet"}
          icon={<TrendingUp className="w-4 h-4 text-[#d97706]" />}
        />
        <StatCard
          label="Tax Liability (44ADA)"
          value={tax ? INR(tax.total_tax) : "—"}
          sub={tax ? `Net payable: ${INR(tax.net_payable)}` : "No data yet"}
          accent={tax && tax.net_payable > 0 ? "text-red-600" : undefined}
          icon={<FileText className="w-4 h-4 text-[#d97706]" />}
        />
      </div>

      {/* Next Deadline */}
      <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d97706]" />
            <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Next Advance Tax Deadline</span>
          </div>
          {deadlinesLoading && <Loader2 className="w-3.5 h-3.5 text-[#8c8577] animate-spin" />}
        </div>
        {nextDeadline ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-[#1a1a2e]">{nextDeadline.installment}</p>
              <p className="text-xs text-[#8c8577]">Due: {new Date(nextDeadline.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#d97706]">{INR(nextDeadline.amount_due)}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                nextDeadline.alert_level === "urgent"
                  ? "bg-red-100 text-red-600"
                  : nextDeadline.alert_level === "warning"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {nextDeadline.days_remaining != null
                  ? nextDeadline.days_remaining > 0
                    ? `${nextDeadline.days_remaining} days left`
                    : "Overdue"
                  : nextDeadline.status}
              </span>
            </div>
          </div>
        ) : (
          <EmptyPanel
            icon={<Calendar className="w-5 h-5 text-[#d97706]" />}
            title="No deadline data"
            desc="Upload your payout PDFs and the agent will calculate your advance tax schedule"
          />
        )}
      </div>

      {/* Tax Breakdown */}
      <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-[#d97706]" />
          <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Tax Computation (Sec 44ADA)</span>
        </div>
        {tax ? (
          <div className="space-y-2 text-xs">
            {[
              { label: "Gross Receipts", val: INR(tax.gross_income), color: "text-[#1a1a2e] font-semibold" },
              { label: "Presumptive Deduction (50%)", val: `−${INR(tax.deduction_44ada)}`, color: "text-[#b45309]" },
              { label: "Net Taxable Income", val: INR(tax.net_taxable_income), color: "text-[#1a1a2e] font-bold" },
              { label: "Calculated Tax + Cess", val: INR(tax.total_tax), color: "text-[#1a1a2e]" },
              { label: "TDS Already Deducted", val: `−${INR(tax.tds_credit)}`, color: "text-blue-600" },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center">
                <span className="text-[#6b675d]">{r.label}</span>
                <span className={r.color}>{r.val}</span>
              </div>
            ))}
            <div className="border-t border-[#e8e2d5] my-1" />
            <div className="flex justify-between items-center bg-[#f4ebd9]/50 rounded-lg px-2.5 py-2 border-l-2 border-[#d97706]">
              <span className="font-bold text-[#b46204]">Balance Tax Payable</span>
              <span className="font-bold text-[#1a1a2e] text-sm">{INR(tax.net_payable)}</span>
            </div>
          </div>
        ) : (
          <EmptyPanel
            icon={<TrendingUp className="w-5 h-5 text-[#d97706]" />}
            title="Tax not calculated yet"
            desc="Ask the agent to calculate your tax, or upload a payout PDF to get started"
          />
        )}
      </div>

      {/* Platform Breakdown */}
      <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#d97706]" />
          <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Income by Platform</span>
        </div>
        {hasIncome ? (
          <div className="space-y-2">
            {Object.entries(income!.platform_breakdown).map(([platform, data]) => {
              const pct = income!.total_gross_income > 0
                ? (data.gross / income!.total_gross_income) * 100
                : 0;
              return (
                <div key={platform}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1a1a2e] capitalize">{platform}</span>
                    <span className="text-[#6b675d]">{INR(data.gross)} · {data.count} entries</span>
                  </div>
                  <div className="w-full bg-[#f4ebd9] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-[#d97706] h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-[#8c8577] pt-1">TDS deducted: {INR(income!.total_tds_deducted)} total</p>
          </div>
        ) : (
          <EmptyPanel
            icon={<UploadCloud className="w-5 h-5 text-[#d97706]" />}
            title="No income data"
            desc='Attach a payout PDF in the chat using the 📎 button'
          />
        )}
      </div>

      {/* All Deadlines */}
      {deadlines?.installments && deadlines.installments.length > 0 && (
        <div className="bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#d97706]" />
            <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Full Advance Tax Schedule</span>
          </div>
          <div className="space-y-2">
            {deadlines.installments.map((d, i) => (
              <div key={i} className={`flex items-center justify-between text-xs p-2.5 rounded-lg ${
                d.status === "paid" ? "bg-green-50 border border-green-100" :
                d.status === "overdue" ? "bg-red-50 border border-red-100" :
                d.status === "due" ? "bg-amber-50 border border-amber-100" :
                "bg-[#f4ebd9]/30 border border-[#e8e2d5]"
              }`}>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{d.installment}</p>
                  <p className="text-[10px] text-[#8c8577]">{new Date(d.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {d.cumulative_percent}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1a1a2e]">{INR(d.amount_due)}</p>
                  <span className={`text-[9px] font-bold uppercase ${
                    d.status === "paid" ? "text-green-600" :
                    d.status === "overdue" ? "text-red-600" :
                    d.status === "due" ? "text-amber-600" : "text-[#8c8577]"
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
