import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  FileText, 
  Wallet, 
  TrendingUp, 
  Award,
  Calendar,
  Zap,
  ChevronRight,
  Bell,
  Settings,
  User,
  Home,
  FileBox,
  CreditCard,
  PieChart
} from "lucide-react";

// Ring Gauge Component
const RingGauge = ({ 
  size = 120, 
  strokeWidth = 10, 
  percentage = 100, 
  color = "#10b981", 
  label = "", 
  subLabel = "",
  valueText = ""
}: { 
  size?: number; 
  strokeWidth?: number; 
  percentage: number; 
  color?: string; 
  label?: string; 
  subLabel?: string;
  valueText?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Animation state
  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  
  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => {
      setAnimatedOffset(strokeDashoffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [strokeDashoffset]);

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#27272a"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Foreground Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: animatedOffset,
              transition: "stroke-dashoffset 1.5s ease-in-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tighter" style={{ color: "white" }}>
            {valueText || `${percentage}%`}
          </span>
        </div>
      </div>
      {(label || subLabel) && (
        <div className="text-center flex flex-col items-center gap-1">
          {label && <span className="text-sm font-medium text-zinc-300">{label}</span>}
          {subLabel && <span className="text-xs text-zinc-500">{subLabel}</span>}
        </div>
      )}
    </div>
  );
};

export function Scorecard() {
  return (
    <div 
      style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5" }}
      className="font-sans flex flex-col overflow-x-hidden selection:bg-emerald-500/30"
    >
      {/* Top Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaxEase</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button className="flex flex-col items-center gap-1 text-emerald-400 group">
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Score</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 group transition-colors">
              <FileBox className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Docs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 group transition-colors">
              <CreditCard className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Payments</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 group transition-colors">
              <PieChart className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Income</span>
            </button>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#09090b]"></span>
            </button>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center ml-2 overflow-hidden">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 lg:gap-8">
        
        {/* Left Column: Scorecard */}
        <div className="flex-1 flex flex-col items-center">
          
          {/* Hero Ring */}
          <div className="mb-16 relative w-full max-w-md mx-auto flex flex-col items-center">
            {/* Glow effect behind main ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-zinc-400 uppercase tracking-[0.2em] text-sm font-semibold mb-2">Tax Health Score</h1>
            </div>
            
            <RingGauge 
              size={300} 
              strokeWidth={20} 
              percentage={82} 
              color="#10b981"
              valueText="82 / 100"
            />
            
            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Ahead of schedule — Q1 advance tax is covered.</span>
            </div>
          </div>

          {/* 4 Small Rings Row */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 px-4">
            <div className="flex justify-center">
              <RingGauge 
                size={120} 
                strokeWidth={8} 
                percentage={100} 
                color="#7c3aed"
                label="Income Tracked"
                subLabel="all sources linked"
              />
            </div>
            <div className="flex justify-center">
              <RingGauge 
                size={120} 
                strokeWidth={8} 
                percentage={50} 
                color="#f59e0b"
                label="Advance Tax"
                subLabel="₹42k of ₹84.5k paid"
              />
            </div>
            <div className="flex justify-center">
              <RingGauge 
                size={120} 
                strokeWidth={8} 
                percentage={100} 
                color="#10b981"
                label="Documents"
                subLabel="all PDFs parsed"
                valueText="3/3"
              />
            </div>
            <div className="flex justify-center">
              <RingGauge 
                size={120} 
                strokeWidth={8} 
                percentage={100} 
                color="#0ea5e9"
                label="Deductions"
                subLabel="44ADA applied"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-6 ml-2">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-start gap-4 hover:bg-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Q4 Files In</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Uploaded 3 statements on time.</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-start gap-4 hover:bg-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">AI Parsed</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">All documents processed accurately.</p>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex items-start gap-4 hover:bg-zinc-900 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Q1 Ready</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">Advance tax calculated instantly.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Next Action */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6">
          
          {/* User Profile Summary */}
          <div className="flex items-center gap-4 mb-2 px-2">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Priya Sharma</h2>
              <p className="text-sm text-zinc-400">Freelance + Delivery • FY 24-25</p>
            </div>
          </div>
          
          {/* Next Action Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/50 px-3 py-1.5 rounded-full">Next Action</span>
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> 84 days left
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-3xl font-black text-white mb-2">Pay ₹21,125</h3>
              <p className="text-zinc-400 font-medium">by Jun 15, 2025</p>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-between group">
              <span>Pay Now via UPI</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-xs text-zinc-600 mt-4">Safe & secure payment gateway</p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" /> Financial Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end pb-3 border-b border-zinc-800/50">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium mb-1">Total Income</span>
                  <span className="text-sm text-zinc-300">₹8,40,000</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium mb-1">Tax Liability</span>
                  <span className="text-sm font-semibold text-white">₹84,500</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium mb-1">Advance Paid</span>
                  <span className="text-sm text-emerald-400">₹42,000</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-zinc-500 font-medium mb-1">Balance Due</span>
                  <span className="text-sm font-semibold text-[#f59e0b]">₹42,500</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Docs Summary */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7c3aed]" /> Recent Uploads
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Upwork_April_2025.pdf</p>
                  <p className="text-[10px] text-zinc-500">Parsed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Swiggy_March_2025.pdf</p>
                  <p className="text-[10px] text-zinc-500">Parsed</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
