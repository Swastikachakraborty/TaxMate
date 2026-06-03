import React, { useState } from "react";
import { 
  FileText, 
  ArrowDownToLine, 
  IndianRupee, 
  CalendarClock, 
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export function Timeline() {
  const [hoverMonth, setHoverMonth] = useState<string | null>(null);

  // FY starts in April
  const months = [
    { id: "apr", name: "Apr", income: "65k", events: 1 },
    { id: "may", name: "May", income: "72k", events: 1 },
    { id: "jun", name: "Jun", income: "58k", events: 2 },
    { id: "jul", name: "Jul", income: "80k", events: 1 },
    { id: "aug", name: "Aug", income: "91k", events: 0 },
    { id: "sep", name: "Sep", income: "63k", events: 1 },
    { id: "oct", name: "Oct", income: "55k", events: 0 },
    { id: "nov", name: "Nov", income: "78k", events: 0 },
    { id: "dec", name: "Dec", income: "84k", events: 1 },
    { id: "jan", name: "Jan", income: "70k", events: 0 },
    { id: "feb", name: "Feb", income: "62k", events: 0 },
    { id: "mar", name: "Mar", income: "62k", events: 2 },
  ];

  const currentMonthId = "jun";

  return (
    <div 
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={{ backgroundColor: "#0a0e1a" }}
    >
      {/* Header & Scrubber */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-medium tracking-tight">Priya Sharma</h1>
            <p className="text-sm text-white/50">Freelance Designer + Swiggy • FY 2024–25</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/50">ITR-4</span>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-blue-400 font-medium flex items-center gap-2">
              <CheckCircle2 size={16} /> Data synced
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="max-w-6xl mx-auto mt-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-px bg-blue-500 -translate-y-1/2 transition-all duration-500"
            style={{ width: "25%" }} // approximate to June
          />
          
          <div className="flex justify-between relative z-10">
            {months.map((m) => {
              const isPast = months.findIndex(x => x.id === m.id) <= months.findIndex(x => x.id === currentMonthId);
              const isCurrent = m.id === currentMonthId;
              
              return (
                <div 
                  key={m.id}
                  className="flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => setHoverMonth(m.id)}
                  onMouseLeave={() => setHoverMonth(null)}
                >
                  <div 
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 mb-2
                      ${isCurrent ? 'bg-blue-500 border-[#0a0e1a] scale-150 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                        isPast ? 'bg-blue-500 border-[#0a0e1a]' : 
                        'bg-[#0a0e1a] border-white/20 group-hover:border-white/50'}`}
                  />
                  <span className={`text-xs font-medium ${isCurrent ? 'text-blue-400' : isPast ? 'text-white/70' : 'text-white/30'}`}>
                    {m.name}
                  </span>
                  
                  {/* Tooltip */}
                  {hoverMonth === m.id && (
                    <div className="absolute top-12 bg-[#111827] border border-white/10 rounded px-3 py-2 text-xs shadow-xl animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="text-white/50 mb-1">{m.name} 2024</div>
                      <div className="font-medium text-green-400">₹{m.income} income</div>
                      {m.events > 0 && <div className="text-blue-400 mt-1">{m.events} events</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex gap-12 relative">
        
        {/* Left: Feed */}
        <div className="flex-1 relative pb-32">
          {/* Vertical line for the feed */}
          <div className="absolute top-0 bottom-0 left-[23px] w-px bg-white/5" />

          {/* feed group: April */}
          <div className="mb-12 relative">
            <div className="sticky top-32 z-40 bg-[#0a0e1a] py-2 mb-6 w-24">
              <span className="text-sm font-semibold text-white/50 tracking-widest uppercase">April</span>
            </div>
            
            <div className="space-y-6">
              <FeedItem 
                icon={<FileText size={16} className="text-blue-400" />}
                date="Apr 10"
                title="Document Parsed"
                desc="Upwork_April_2025.pdf was successfully analyzed."
                color="blue"
              />
              <FeedItem 
                icon={<IndianRupee size={16} className="text-green-400" />}
                date="Apr 15"
                title="Income Tracked"
                desc="₹65,000 registered from Upwork and Swiggy."
                amount="+₹65,000"
                color="green"
              />
            </div>
          </div>

          {/* feed group: May */}
          <div className="mb-12 relative">
            <div className="sticky top-32 z-40 bg-[#0a0e1a] py-2 mb-6 w-24">
              <span className="text-sm font-semibold text-white/50 tracking-widest uppercase">May</span>
            </div>
            
            <div className="space-y-6">
              <FeedItem 
                icon={<IndianRupee size={16} className="text-green-400" />}
                date="May 31"
                title="Income Tracked"
                desc="₹72,000 registered across multiple sources."
                amount="+₹72,000"
                color="green"
              />
            </div>
          </div>

          {/* feed group: June (Current) */}
          <div className="mb-12 relative">
            <div className="sticky top-32 z-40 bg-[#0a0e1a] py-2 mb-6 w-24">
              <span className="text-sm font-semibold text-blue-400 tracking-widest uppercase flex items-center gap-2">
                June <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </span>
            </div>
            
            <div className="space-y-6">
              <FeedItem 
                icon={<CalendarClock size={16} className="text-amber-400" />}
                date="Jun 10"
                title="Deadline Approaching"
                desc="Advance Tax Q1 payment is due in 5 days."
                color="amber"
              />
              
              {/* The "What's next" active card */}
              <div className="ml-12 pl-4">
                <div className="bg-[#111827] border border-blue-500/30 rounded-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
                        <AlertCircle size={16} /> Action Required
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">Pay Advance Tax (Q1)</h3>
                      <p className="text-white/60 text-sm mb-4">You need to pay 15% of your estimated tax liability by June 15.</p>
                      
                      <div className="bg-[#0a0e1a]/50 border border-white/5 rounded-lg p-3 inline-flex items-center gap-4">
                        <div>
                          <div className="text-xs text-white/40 mb-0.5">Amount Due</div>
                          <div className="font-mono text-white">₹15,000</div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded transition-colors flex items-center gap-2">
                          Pay Now <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* feed group: Future previews */}
          <div className="mb-12 relative opacity-40">
             <div className="sticky top-32 z-40 bg-[#0a0e1a] py-2 mb-6 w-24">
              <span className="text-sm font-semibold text-white/30 tracking-widest uppercase">Future</span>
            </div>
            
            <div className="space-y-6">
               <FeedItem 
                icon={<Clock size={16} className="text-white/40" />}
                date="Sep 15"
                title="Advance Tax Q2"
                desc="Estimated ₹27,000 payment based on current run rate."
                color="gray"
              />
               <FeedItem 
                icon={<Clock size={16} className="text-white/40" />}
                date="Mar 31"
                title="End of Financial Year"
                desc="Final tax calculation and remaining balance."
                color="gray"
              />
            </div>
          </div>

        </div>

        {/* Right Sidebar (~220px) */}
        <aside className="w-[260px] shrink-0 sticky top-40 self-start space-y-4">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6">Forward Looking</h2>
          
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/50 mb-1">Total Estimated Income</div>
            <div className="text-2xl font-mono tracking-tight mb-4 flex items-center gap-2">
              ₹8,40,000 <TrendingUp size={14} className="text-green-400" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Upwork</span>
                <span className="font-mono">₹5.2L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Swiggy</span>
                <span className="font-mono">₹2.1L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Interest</span>
                <span className="font-mono">₹10K</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/50 mb-1">Balance Due</div>
            <div className="text-2xl font-mono tracking-tight mb-4 text-amber-400">
              ₹42,500
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: "50%" }} />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Paid: ₹42,000</span>
              <span>Total: ₹84,500</span>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/50 mb-1">Next Deadline</div>
            <div className="text-lg text-white mb-1">Jun 15, 2025</div>
            <div className="text-sm text-white/50">Advance Tax (Q1)</div>
          </div>

        </aside>

      </main>
    </div>
  );
}

// Subcomponents

function FeedItem({ 
  icon, 
  date, 
  title, 
  desc, 
  amount,
  color
}: { 
  icon: React.ReactNode; 
  date: string; 
  title: string; 
  desc: string; 
  amount?: string;
  color: "blue" | "green" | "amber" | "gray";
}) {
  const colorStyles = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    gray: "bg-white/5 border-white/10 text-white/40",
  };

  const ringStyles = {
    blue: "ring-blue-500/20 bg-[#0a0e1a]",
    green: "ring-green-500/20 bg-[#0a0e1a]",
    amber: "ring-amber-500/20 bg-[#0a0e1a]",
    gray: "ring-white/10 bg-[#0a0e1a]",
  };

  return (
    <div className="flex group">
      <div className="w-12 shrink-0 flex flex-col items-center relative">
        <div className={`w-8 h-8 rounded-full border ${colorStyles[color]} flex items-center justify-center z-10 ring-4 ${ringStyles[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex-1 pb-2">
        <div className="flex items-baseline justify-between mb-1">
          <h4 className="text-white font-medium">{title}</h4>
          <span className="text-xs text-white/40 font-mono">{date}</span>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-lg p-4 group-hover:border-white/10 transition-colors flex justify-between items-center">
          <p className="text-sm text-white/60">{desc}</p>
          {amount && <span className="font-mono text-sm text-green-400 font-medium">{amount}</span>}
        </div>
      </div>
    </div>
  );
}
