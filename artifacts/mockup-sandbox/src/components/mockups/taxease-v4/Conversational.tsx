import React, { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, 
  Send, 
  Wallet, 
  FileText, 
  PieChart, 
  Settings,
  Home,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Conversational() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#0a0a0a] text-white overflow-hidden">
      {/* Top Status Strip */}
      <div className="h-10 w-full border-b border-white/5 bg-[#111111] flex items-center justify-center gap-3 px-4 shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs font-medium text-white/80">
          <IndianRupee className="w-3.5 h-3.5 text-orange-500" />
          <span>₹8.4L Income</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs font-medium text-white/80">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>₹84.5K Tax Due</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs font-medium text-white/80">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>₹42K Paid</span>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-medium border border-orange-500/20">
          <Calendar className="w-3.5 h-3.5" />
          <span>Jun 15 Deadline</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[80px] md:w-[200px] shrink-0 bg-[#111111] border-r border-white/5 flex flex-col items-center md:items-start py-6">
          <div className="px-0 md:px-6 mb-12 flex items-center gap-3 w-full justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-semibold text-lg hidden md:block tracking-tight">TaxEase</span>
          </div>

          <nav className="flex-1 w-full flex flex-col gap-2 px-3 md:px-4">
            {[
              { icon: Home, active: true },
              { icon: FileText, active: false },
              { icon: PieChart, active: false },
              { icon: Wallet, active: false },
              { icon: Settings, active: false },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-12 md:w-full h-12 flex items-center justify-center md:justify-start md:px-4 gap-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-orange-500/10 text-orange-500' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </nav>

          <div className="mt-auto px-3 md:px-4 w-full flex justify-center md:justify-start">
            <button className="w-12 h-12 md:w-full md:h-auto flex items-center gap-3 p-0 md:p-2 rounded-xl hover:bg-white/5 transition-all">
              <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                <AvatarFallback className="bg-[#1a1a1a] text-orange-500 font-medium text-sm">PS</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium truncate w-full">Priya Sharma</span>
                <span className="text-xs text-white/40 truncate w-full">Pro Plan</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Conversation Area */}
        <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full h-[calc(100vh-40px)]">
          
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth pb-40"
          >
            {/* Message 1: Bot Introduction */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-[#1a1a1a] border-l-2 border-orange-500 rounded-2xl rounded-tl-none p-4 md:p-5 text-sm md:text-base text-white/90 leading-relaxed shadow-sm">
                  Good morning, Priya. FY 2024–25 is almost done. Your tax liability is <span className="text-white font-medium">₹84,500</span> — and you've already paid <span className="text-white font-medium">₹42,000</span> as advance tax. Here's what needs your attention before June 15...
                </div>
                
                {/* Inline Data Card */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 shadow-sm max-w-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/90">Q1 Advance Tax</h4>
                      <p className="text-xs text-orange-500 mt-0.5">Due June 15</p>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold tracking-tight text-white mb-4">
                    ₹21,125
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-white/90 h-10 rounded-xl font-medium">
                    Pay Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Message 2: User */}
            <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
              <Avatar className="w-8 h-8 shrink-0 border border-white/10 mt-1">
                <AvatarFallback className="bg-[#1a1a1a] text-orange-500 text-xs font-medium">PS</AvatarFallback>
              </Avatar>
              <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none p-4 md:p-5 text-sm md:text-base leading-relaxed shadow-sm">
                Can I still claim my internet expenses?
              </div>
            </div>

            {/* Message 3: Bot Response */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              </div>
              <div className="bg-[#1a1a1a] border-l-2 border-orange-500 rounded-2xl rounded-tl-none p-4 md:p-5 text-sm md:text-base text-white/90 leading-relaxed shadow-sm">
                Under Section 44ADA presumptive taxation, your 50% flat deduction (₹4,20,000) already covers all business expenses — laptop, internet, office supplies. You don't need to track receipts separately. Your deduction is already applied.
              </div>
            </div>

            {/* Message 4: User */}
            <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
              <Avatar className="w-8 h-8 shrink-0 border border-white/10 mt-1">
                <AvatarFallback className="bg-[#1a1a1a] text-orange-500 text-xs font-medium">PS</AvatarFallback>
              </Avatar>
              <div className="bg-orange-500 text-white rounded-2xl rounded-tr-none p-4 md:p-5 text-sm md:text-base leading-relaxed shadow-sm">
                How much should I pay on June 15?
              </div>
            </div>

            {/* Message 5: Bot Response with Card */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 mt-1">
                <div className="w-3 h-3 bg-orange-500 rounded-sm" />
              </div>
              <div className="flex flex-col gap-3">
                
                {/* Inline Data Card */}
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 shadow-sm max-w-sm mt-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-semibold tracking-tight text-white">₹21,125</div>
                      <p className="text-xs text-white/50 mt-1">25% of annual liability</p>
                    </div>
                    <div className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-xs font-medium">
                      Q1 Installment
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <Button variant="outline" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white h-10 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-white/50" />
                      Mark as Paid
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Bottom Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-12 pb-6 px-4 md:px-8 z-20">
            <div className="max-w-3xl mx-auto">
              
              {/* Suggested Questions */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
                {[
                  "Upload new invoice",
                  "What if I miss the deadline?",
                  "Show my tax breakdown"
                ].map((q, i) => (
                  <button 
                    key={i}
                    className="whitespace-nowrap px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-white/5 rounded-full text-xs font-medium text-white/70 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="relative flex items-center bg-[#111111] border border-white/10 rounded-full p-2 shadow-lg focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
                <button className="w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about your taxes..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 px-3 text-sm md:text-base"
                />
                <button 
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors shrink-0 ${
                    inputValue.trim() 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] text-white/30">TaxEase AI can make mistakes. Please verify important information.</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
