import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const strokeWidth = 12;
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
        stroke="hsl(0 0% 12%)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="hsl(25 95% 53%)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        style={{ filter: "drop-shadow(0 0 8px hsl(25 95% 53% / 0.6))" }}
      />
      <text x={cx} y={cy - 18} textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="Inter">
        {percentage}%
      </text>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="hsl(240 5% 46%)" fontSize="12" fontFamily="Inter">
        of income as tax
      </text>
    </svg>
  );
}

export default function TaxSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
    >
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Tax Summary</h1>
          <p className="text-muted-foreground">Your complete tax picture for FY 2024–25 (New Tax Regime)</p>
        </div>
        <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1.5 text-sm font-medium">
          <FileText className="w-4 h-4 mr-1.5 inline" />
          You likely need ITR-4
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 bg-card border-border flex flex-col items-center py-8 px-4">
          <p className="text-sm font-medium text-muted-foreground mb-4">Live Tax Liability</p>
          <TaxArc percentage={10} />
          <p className="mt-4 text-2xl font-bold text-white">₹84,500</p>
          <p className="text-sm text-muted-foreground mt-1">Total Tax Payable</p>
        </Card>

        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Gross Income", value: "₹8,40,000", icon: TrendingUp, sub: "Upwork + Swiggy + Bank Interest", color: "text-primary" },
            { label: "Standard Deduction (44ADA)", value: "₹4,20,000", icon: IndianRupee, sub: "50% of gross receipts", color: "text-secondary" },
            { label: "Net Taxable Income", value: "₹4,20,000", icon: IndianRupee, sub: "After 44ADA presumptive deduction", color: "text-green-500" },
            { label: "Total Tax + Cess", value: "₹84,500", icon: FileText, sub: "Including 4% health & education cess", color: "text-orange-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="bg-card border-border h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded bg-white/5 ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tax Slab Breakdown (New Regime FY 2024–25)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="tax-slabs-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Income Slab</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Rate</th>
                  <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Taxable Amount</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Tax</th>
                </tr>
              </thead>
              <tbody>
                {TAX_SLABS.map((slab, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 text-white">{slab.range}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-medium ${slab.rate === "0%" ? "text-muted-foreground" : "text-primary"}`}>
                        {slab.rate}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-white font-mono">{slab.taxable}</td>
                    <td className="py-3 text-right font-mono font-semibold text-white">{slab.tax}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td colSpan={3} className="py-3 pr-4 font-bold text-white">Total Tax + 4% Cess</td>
                  <td className="py-3 text-right font-bold text-primary font-mono text-base">₹84,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Advance Tax Installments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADVANCE_TAX.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-4 rounded-xl border transition-colors ${
                  item.status === "Due"
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white/3 border-border"
                }`}
                data-testid={`advance-tax-${i}`}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">{item.installment}</p>
                <p className="text-lg font-bold text-white">{item.amount}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.dueDate}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.percent} of annual</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.status === "Due"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-white/5 text-muted-foreground"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
