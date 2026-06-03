import React, { useEffect, useState, useRef } from 'react';
import { 
  Home, 
  FileText, 
  PieChart as PieChartIcon, 
  Clock, 
  Settings,
  ArrowRight
} from 'lucide-react';

export function FlowMap() {
  const TOTAL_INCOME = 840000;
  const UPWORK = 520000;
  const SWIGGY = 210000;
  const BANK = 110000; // Adjusted to sum to 840,000 to match the math: 520k + 210k + 110k = 840k. Wait, prompt says 10,000 for Bank and 520k + 210k + 10k = 740k. The prompt says "totaling ₹8,40,000". Wait: 840,000 - 520,000 - 210,000 = 110,000. Let's assume bank is 110k, but the prompt says Bank Interest: ₹10,000 (1%). 
  // If the prompt strictly says 8,40,000 total and upwork 520k, swiggy 210k, bank 10k -> that totals 740k. 
  // But wait, the prompt says: "Total income: ₹8,40,000 (Upwork ₹5,20,000 + Swiggy ₹2,10,000 + Bank Interest ₹10,000)". That's literally in the prompt. I will use the numbers in the prompt, despite the math error in the prompt's source.
  // Actually, I'll just use the widths: 62%, 25%, 13% for the UI, but show the prompt's numbers.

  return (
    <div className="flex min-h-[100vh] bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col justify-between shrink-0 z-20">
        <div>
          <div className="p-6">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-600 flex items-center justify-center">
                <span className="text-sm font-black">T</span>
              </div>
              TaxEase
            </h1>
          </div>
          <nav className="mt-4 px-3 space-y-0.5">
            <NavItem icon={<Home size={18} />} label="Overview" />
            <NavItem icon={<FileText size={18} />} label="Documents" />
            <NavItem icon={<PieChartIcon size={18} />} label="Flow Map" active />
            <NavItem icon={<Clock size={18} />} label="Timeline" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="p-4 mb-4">
          <div className="bg-[#141414] p-4 rounded-xl border border-[#222]">
            <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-widest">FY 2024-25 Progress</p>
            <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 w-[100%]" />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-medium text-gray-600">
              <span>Apr '24</span>
              <span className="text-teal-500">Mar '25</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="p-8 lg:p-12 max-w-6xl w-full mx-auto flex flex-col min-h-full">
          
          <header className="mb-12">
            <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Financial Flow</h2>
            <p className="text-gray-400 text-sm">Visualizing exactly where your money goes this financial year.</p>
          </header>

          <div className="flex-1 flex flex-col relative">
            
            {/* TOP SECTION: Income Sources */}
            <div className="mb-2 relative z-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold">Total Income</span>
                <span className="font-mono text-4xl font-semibold tracking-tight">₹8,40,000</span>
              </div>
              
              <div className="h-14 w-full rounded-xl overflow-hidden flex shadow-2xl ring-1 ring-white/5">
                <div style={{ width: '62%' }} className="bg-teal-600 h-full px-4 flex items-center justify-between relative group hover:bg-teal-500 transition-colors cursor-default">
                  <span className="font-semibold text-sm z-10 text-teal-50">Upwork</span>
                  <span className="font-mono text-sm font-medium z-10 text-teal-100">₹5,20,000</span>
                </div>
                <div style={{ width: '25%' }} className="bg-orange-500 h-full px-4 flex items-center justify-between relative group hover:bg-orange-400 transition-colors cursor-default">
                  <span className="font-semibold text-sm z-10 text-orange-50">Swiggy</span>
                  <span className="font-mono text-sm font-medium z-10 text-orange-100">₹2,10,000</span>
                </div>
                <div style={{ width: '13%' }} className="bg-violet-600 h-full px-4 flex items-center justify-between relative group hover:bg-violet-500 transition-colors cursor-default">
                  <span className="font-semibold text-sm z-10 text-violet-50 truncate mr-2">Bank</span>
                  <span className="font-mono text-sm font-medium z-10 text-violet-100">₹10,000</span>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION: SVG Connector Lines */}
            <div className="h-40 w-full relative z-0 -mt-2 -mb-2 opacity-80">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 160">
                <defs>
                  <linearGradient id="tax-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                {/* 
                  Assume Take-home block is left 60%, Tax block is right 40%.
                  Income centers: Upwork (~31%), Swiggy (~74.5%), Bank (~93.5%)
                  Take-home center: ~30%
                  Tax center: ~80%
                */}
                
                {/* Upwork to Take-Home */}
                <path d="M 310 0 C 310 80, 250 80, 250 160" stroke="#0d9488" strokeWidth="180" fill="none" opacity="0.15" />
                <path d="M 310 0 C 310 80, 250 80, 250 160" stroke="#0d9488" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5" />
                
                {/* Swiggy to Take-Home */}
                <path d="M 745 0 C 745 80, 450 80, 450 160" stroke="#f97316" strokeWidth="80" fill="none" opacity="0.15" />
                <path d="M 745 0 C 745 80, 450 80, 450 160" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5" />
                
                {/* Bank to Take-Home */}
                <path d="M 935 0 C 935 80, 550 80, 550 160" stroke="#8b5cf6" strokeWidth="20" fill="none" opacity="0.15" />
                <path d="M 935 0 C 935 80, 550 80, 550 160" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5" />
                
                {/* Tax Branching off from main flow */}
                <path d="M 500 60 C 600 100, 800 100, 800 160" stroke="url(#tax-grad)" strokeWidth="60" fill="none" />
                <path d="M 500 60 C 600 100, 800 100, 800 160" stroke="#e11d48" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.8" />
              </svg>
            </div>

            {/* BOTTOM SECTION: Destinations */}
            <div className="flex gap-6 z-10 flex-1 min-h-[280px]">
              
              {/* LEFT BLOCK: Take-Home (~60%) */}
              <div className="flex-[6] bg-[#022c22] rounded-2xl p-8 border border-[#065f46] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#059669] transition-colors">
                <div className="absolute top-0 right-0 p-40 bg-emerald-500 opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.06] transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-emerald-500 uppercase tracking-widest text-xs font-bold">Take-Home</h3>
                    <div className="bg-[#064e3b] text-emerald-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Kept</div>
                  </div>
                  <div className="font-mono text-5xl font-light text-emerald-50 mb-3 tracking-tight">₹7,55,500</div>
                  <div className="text-emerald-400/60 text-sm font-mono flex items-center gap-2">
                    <span>₹8,40,000</span>
                    <span className="text-emerald-500/40">−</span>
                    <span className="text-rose-400/80">₹84,500 tax</span>
                  </div>
                </div>

                <div className="bg-[#021c15] rounded-xl p-5 border border-[#064e3b] flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-emerald-100 text-sm font-medium">44ADA Deduction</span>
                    </div>
                    <span className="font-mono text-emerald-400 text-sm font-medium">₹4,20,000 protected</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#064e3b] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[50%]" />
                  </div>
                </div>
              </div>

              {/* RIGHT BLOCK: Tax Breakdown (~40%) */}
              <div className="flex-[4] bg-[#2a0e14] rounded-2xl p-8 border border-[#4c1d28] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#881337] transition-colors">
                <div className="absolute top-0 left-0 p-40 bg-rose-500 opacity-[0.03] blur-[100px] rounded-full group-hover:opacity-[0.06] transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-rose-500 uppercase tracking-widest text-xs font-bold">Tax Liability</h3>
                    <div className="bg-[#4c1d28] text-rose-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Owed</div>
                  </div>
                  <div className="font-mono text-5xl font-light text-rose-50 mb-6 tracking-tight">₹84,500</div>
                </div>

                <div className="space-y-5 relative z-10">
                  <div className="flex h-4 w-full rounded-full overflow-hidden bg-[#1a080c] ring-1 ring-rose-900/50">
                    <div className="bg-rose-600 h-full relative" style={{ width: '49.7%' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="bg-[#4c1d28] h-full" style={{ width: '50.3%', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(244,63,94,0.15) 4px, rgba(244,63,94,0.15) 8px)' }} />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-rose-500/80 text-[10px] font-bold uppercase tracking-widest mb-1">Tax Paid</span>
                      <span className="font-mono text-rose-200 font-medium">₹42,000</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-rose-500/80 text-[10px] font-bold uppercase tracking-widest mb-1">Tax Due</span>
                      <span className="font-mono text-rose-300 font-medium">₹42,500</span>
                    </div>
                  </div>

                  <div className="bg-[#1f0a0f] rounded-xl p-4 border border-[#3e141f] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-rose-500" />
                      <span className="text-rose-200 text-sm font-medium">Q1 Installment</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-rose-400 text-sm font-bold">₹21,125</div>
                      <div className="text-[10px] text-rose-500/80 font-bold uppercase tracking-wider">Due Jun 15</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active 
          ? 'bg-[#1a1a1a] text-white font-medium border border-[#333]' 
          : 'text-gray-400 hover:text-white hover:bg-[#111] border border-transparent'
      }`}
    >
      <div className={`${active ? 'text-teal-500' : 'text-gray-500'}`}>
        {icon}
      </div>
      {label}
    </a>
  );
}
