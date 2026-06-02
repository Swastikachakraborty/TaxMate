export const user = {
  name: "Priya Sharma",
  initials: "PS",
  role: "Freelance Designer + Delivery Partner",
  fy: "2024-25",
  ayear: "2025-26",
};

export const incomeSources = [
  { name: "Upwork", amount: 520000, color: "#d97706" },
  { name: "Swiggy", amount: 210000, color: "#b45309" },
  { name: "Bank Interest", amount: 10000, color: "#92400e" },
];

export const totalIncome = 840000;
export const taxLiability = 84500;
export const advanceTaxPaid = 42000;
export const nextDeadline = "June 15, 2025";

export const monthlyIncome = [
  { month: "Apr", income: 62000 },
  { month: "May", income: 58000 },
  { month: "Jun", income: 75000 },
  { month: "Jul", income: 71000 },
  { month: "Aug", income: 68000 },
  { month: "Sep", income: 82000 },
  { month: "Oct", income: 73000 },
  { month: "Nov", income: 69000 },
  { month: "Dec", income: 78000 },
  { month: "Jan", income: 65000 },
  { month: "Feb", income: 72000 },
  { month: "Mar", income: 67000 },
];

export const recentUploads = [
  { file: "swiggy_earnings_jan.pdf", platform: "Swiggy", date: "Jan 15, 2025", status: "Parsed" },
  { file: "upwork_invoice_q1.pdf", platform: "Upwork", date: "Mar 31, 2025", status: "Parsed" },
  { file: "sbi_statement_q4.pdf", platform: "Bank", date: "Apr 02, 2025", status: "Parsed" },
];

export const taxBreakdown = {
  grossIncome: 840000,
  deduction44ADA: 420000,
  netTaxable: 420000,
  taxBeforeCess: 81250,
  cess: 3250,
  totalTax: 84500,
  advanceTaxPaid: 42000,
  remainingTax: 42500,
};

export const taxSlabs = [
  { range: "₹0 – ₹3,00,000", rate: "Nil", tax: 0 },
  { range: "₹3,00,001 – ₹7,00,000", rate: "5%", tax: 6000 },
  { range: "₹7,00,001 – ₹10,00,000", rate: "10%", tax: 0 },
  { range: "₹10,00,001 – ₹12,00,000", rate: "15%", tax: 0 },
  { range: "₹12,00,001 – ₹15,00,000", rate: "20%", tax: 0 },
  { range: "Above ₹15,00,000", rate: "30%", tax: 0 },
];

export const advanceTaxSchedule = [
  { date: "June 15, 2025", percent: "15%", amount: 12675, status: "Due" },
  { date: "Sept 15, 2025", percent: "45%", amount: 38025, status: "Upcoming" },
  { date: "Dec 15, 2025", percent: "75%", amount: 63375, status: "Upcoming" },
  { date: "Mar 15, 2026", percent: "100%", amount: 84500, status: "Upcoming" },
];

export const chatMessages = [
  {
    id: 1,
    role: "user" as const,
    text: "What's my total tax liability for this year?",
  },
  {
    id: 2,
    role: "ai" as const,
    text: "Based on your uploaded income documents, here's your tax summary for FY 2024-25:\n\n**Gross Income: ₹8,40,000**\n• Upwork: ₹5,20,000\n• Swiggy: ₹2,10,000\n• Bank Interest: ₹10,000\n\n**Under Section 44ADA** (Presumptive Taxation):\n• Presumptive Income (50%): ₹4,20,000\n\n**Tax Calculation (New Regime):**\n• Up to ₹3L: Nil\n• ₹3L–₹7L @ 5%: ₹20,000\n• ₹7L–₹10L @ 10%: ₹14,500\n• Health & Education Cess (4%): ₹3,250\n\n**Total Tax Liability: ₹84,500**\n\nYou've already paid ₹42,000 in advance tax. The remaining ₹42,500 is due by March 15, 2026.",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Can I claim my laptop as a business expense?",
  },
  {
    id: 4,
    role: "ai" as const,
    text: "Great question! Since you're using **Section 44ADA (Presumptive Taxation)**, here's the key point:\n\n⚠️ Under 44ADA, you **cannot claim separate business expenses.** The 50% deduction on your gross receipts is deemed to cover ALL business expenses — including your laptop, internet, software subscriptions, etc.\n\nHowever, if your actual expenses exceed 50% of your income, you could consider:\n\n1. **Opting out of 44ADA** and maintaining books of accounts\n2. This would require a tax audit if turnover > ₹50L\n3. You'd need to keep receipts for all claimed expenses\n\n💡 **My recommendation:** Since your total income is ₹8.4L, the 44ADA route (₹4.2L deduction) is highly beneficial and eliminates complex bookkeeping.",
  },
];

export const itrExportData = {
  formType: "ITR-4 (Sugam)",
  assessmentYear: "2025-26",
  pan: "ABCPS1234K",
  name: "Priya Sharma",
  dob: "15/08/1995",
  address: "Mumbai, Maharashtra",
  grossIncome: 840000,
  deduction44ADA: 420000,
  netTaxable: 420000,
  totalTax: 84500,
  advanceTaxPaid: 42000,
  balanceDue: 42500,
};

export const formatINR = (amount: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
