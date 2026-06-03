import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  FileText, 
  PieChart, 
  ArrowRight, 
  Upload, 
  Download, 
  Home, 
  Settings, 
  CheckCircle2,
  Calendar,
  CreditCard,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const chartData = [
  { month: 'Apr', amount: 65000 },
  { month: 'May', amount: 72000 },
  { month: 'Jun', amount: 58000 },
  { month: 'Jul', amount: 80000 },
  { month: 'Aug', amount: 91000 },
  { month: 'Sep', amount: 63000 },
  { month: 'Oct', amount: 55000 },
  { month: 'Nov', amount: 78000 },
  { month: 'Dec', amount: 84000 },
  { month: 'Jan', amount: 70000 },
  { month: 'Feb', amount: 62000 },
  { month: 'Mar', amount: 62000 },
];

export function Editorial() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1a1a2e] font-sans flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#fdfbf7] border-r border-[#e8e2d5] flex flex-col justify-between py-8 px-6 hidden md:flex shrink-0">
        <div>
          <div className="mb-12">
            <h1 className="font-['Playfair_Display'] text-2xl font-bold tracking-tight text-[#1a1a2e]">
              TaxEase.
            </h1>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-[#f4ebd9]/40 text-[#1a1a2e] border-l-2 border-[#d97706] transition-colors">
              <Home className="h-4 w-4 text-[#d97706]" />
              Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 transition-colors">
              <FileText className="h-4 w-4" />
              Documents
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 transition-colors">
              <PieChart className="h-4 w-4" />
              Tax Forms
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 transition-colors">
              <CreditCard className="h-4 w-4" />
              Payments
            </a>
          </nav>
        </div>
        
        <div className="space-y-4">
          <div className="px-3 py-4 rounded-xl bg-[#f4ebd9]/30 border border-[#e8e2d5]">
            <p className="text-xs font-semibold text-[#8c8577] uppercase tracking-wider mb-1">Form Status</p>
            <p className="text-sm font-medium text-[#1a1a2e] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#d97706]" />
              ITR-4 Ready
            </p>
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-medium text-[#d97706] tracking-wide uppercase mb-2">FY 2024-2025</p>
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#1a1a2e] tracking-tight leading-tight">
                Priya's Annual Summary
              </h2>
              <p className="text-[#6b675d] mt-3 max-w-xl leading-relaxed text-lg">
                Freelance designer & Swiggy delivery partner. Your tax liability has been calculated based on your recent document uploads.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button className="bg-transparent border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white rounded-full px-6 transition-all h-11 font-medium">
                Download Report
              </Button>
              <Button className="bg-[#d97706] hover:bg-[#b46204] text-white rounded-full px-6 transition-all h-11 font-medium border-none shadow-sm">
                Pay Balance
              </Button>
            </div>
          </header>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-transparent border-[#e8e2d5] rounded-2xl shadow-none">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-[#6b675d] uppercase tracking-wider">
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e] mb-2">
                  ₹8,40,000
                </div>
                <div className="text-sm text-[#8c8577] flex flex-col gap-1 mt-3 border-t border-[#e8e2d5]/60 pt-3">
                  <span className="flex justify-between"><span>Upwork</span> <span className="font-medium">₹5,20,000</span></span>
                  <span className="flex justify-between"><span>Swiggy</span> <span className="font-medium">₹2,10,000</span></span>
                  <span className="flex justify-between"><span>Interest</span> <span className="font-medium">₹10,000</span></span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-[#e8e2d5] rounded-2xl shadow-none">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-[#6b675d] uppercase tracking-wider">
                  Tax Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e]">
                  ₹84,500
                </div>
                <p className="text-sm text-[#8c8577] mt-3 border-t border-[#e8e2d5]/60 pt-3">
                  Calculated under new regime
                </p>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-[#e8e2d5] rounded-2xl shadow-none">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-[#6b675d] uppercase tracking-wider">
                  Advance Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="font-['Playfair_Display'] text-3xl font-semibold text-[#1a1a2e]">
                  ₹42,000
                </div>
                <p className="text-sm text-[#8c8577] mt-3 border-t border-[#e8e2d5]/60 pt-3">
                  Via TDS & Self-assessment
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfaf7] border-[#d97706]/30 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#d97706]"></div>
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-[#d97706] uppercase tracking-wider">
                  Balance Due
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="font-['Playfair_Display'] text-4xl font-bold text-[#1a1a2e]">
                  ₹42,500
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e] mt-3 border-t border-[#d97706]/20 pt-3">
                  <Calendar className="h-3.5 w-3.5 text-[#d97706]" />
                  Due Jun 15, 2025
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a2e]">Income Flow</h3>
              </div>
              <div className="bg-transparent border border-[#e8e2d5] rounded-2xl p-6 shadow-none h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8c8577', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#8c8577', fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f4ebd9', opacity: 0.4 }}
                      contentStyle={{ 
                        backgroundColor: '#1a1a2e', 
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Income']}
                      labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
                    />
                    <Bar 
                      dataKey="amount" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 || index === 4 || index === 7 ? '#d97706' : '#e2d3b6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a2e]">Recent Documents</h3>
                <Button variant="ghost" size="sm" className="text-[#d97706] hover:text-[#b46204] hover:bg-[#f4ebd9]/40 p-0 h-auto font-medium">
                  Upload <Upload className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Upwork_April_2025.pdf", type: "Income", date: "2 days ago" },
                  { name: "Swiggy_March_2025.pdf", type: "Income", date: "1 week ago" },
                  { name: "Bank_Statement_Q4.pdf", type: "Statement", date: "2 weeks ago" }
                ].map((doc, i) => (
                  <div key={i} className="group p-4 rounded-xl border border-[#e8e2d5] bg-transparent hover:bg-[#fdfbf7] transition-all cursor-pointer flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#f4ebd9]/50 rounded-lg text-[#d97706]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a2e] mb-1 group-hover:text-[#d97706] transition-colors">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-[#8c8577]">
                          <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider text-[#6b675d] border-[#e8e2d5] bg-transparent px-1.5 py-0 h-5">Parsed</Badge>
                          <span>{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8c8577] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2 border-[#e8e2d5] text-[#1a1a2e] hover:bg-[#f4ebd9]/30 rounded-xl h-12 font-medium">
                  View all documents
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
