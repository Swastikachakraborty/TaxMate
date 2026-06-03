import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  Settings, 
  LogOut,
  Bell,
  Search,
  IndianRupee,
  Calendar,
  AlertCircle,
  TrendingUp,
  Download,
  FileCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const monthlyData = [
  { name: 'Apr', value: 65 },
  { name: 'May', value: 72 },
  { name: 'Jun', value: 58 },
  { name: 'Jul', value: 80 },
  { name: 'Aug', value: 91 },
  { name: 'Sep', value: 63 },
  { name: 'Oct', value: 55 },
  { name: 'Nov', value: 78 },
  { name: 'Dec', value: 84 },
  { name: 'Jan', value: 70 },
  { name: 'Feb', value: 62 },
  { name: 'Mar', value: 62 },
];

const GlassCard = ({ children, className = '', glowColor = '' }: { children: React.ReactNode, className?: string, glowColor?: string }) => {
  return (
    <div 
      className={`rounded-2xl relative overflow-hidden ${className}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: glowColor ? `0 0 30px ${glowColor}` : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="relative z-10 w-full h-full p-6">
        {children}
      </div>
      {glowColor && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)`
          }}
        />
      )}
    </div>
  );
};

export function Glass() {
  return (
    <div 
      className="min-h-screen w-full flex overflow-hidden text-white font-sans"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 40%, #0c1445 100%)',
      }}
    >
      {/* Background Aurora Glows */}
      <div 
        className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: '#8b5cf6' }}
      />
      <div 
        className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none opacity-30"
        style={{ background: '#06b6d4' }}
      />

      {/* Sidebar */}
      <aside 
        className="w-[220px] flex-shrink-0 flex flex-col h-screen border-r relative z-20"
        style={{
          backgroundColor: 'rgba(15, 12, 41, 0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: 'rgba(255,255,255,0.08)'
        }}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-wide">TaxEase</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: FileText, label: 'Returns', active: false },
            { icon: UploadCloud, label: 'Documents', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                item.active 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} style={{ color: item.active ? '#8b5cf6' : 'currentColor' }} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-white/50 mb-2">Need help?</p>
            <Button size="sm" className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg">
              Contact Expert
            </Button>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white transition-colors rounded-xl">
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10">
        <header className="sticky top-0 z-30 px-8 py-5 flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(15, 12, 41, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search documents or transactions..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-white/60 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-white">Priya Sharma</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>ITR-4 • Freelancer</p>
              </div>
              <Avatar className="h-10 w-10 border border-white/20">
                <AvatarImage src="https://i.pravatar.cc/150?u=priya" />
                <AvatarFallback className="bg-[#8b5cf6] text-white">PS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          
          {/* Welcome & Action */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight">Financial Overview</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Here's how your taxes are looking for FY 2024-25</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl px-5 h-11">
                <Download className="mr-2" size={16} /> Download Report
              </Button>
              <Button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] rounded-xl px-5 h-11 border-0">
                <Plus className="mr-2" size={16} /> New Income
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard glowColor="rgba(6, 182, 212, 0.15)">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4]">
                  <IndianRupee size={20} />
                </div>
                <Badge variant="outline" className="border-[#06b6d4]/30 text-[#06b6d4] bg-[#06b6d4]/10 rounded-full px-3">
                  +12.5% YoY
                </Badge>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Income</p>
              <h3 className="text-3xl font-bold tracking-tight">₹8,40,000</h3>
            </GlassCard>

            <GlassCard glowColor="rgba(239, 68, 68, 0.1)">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-white/5 text-white/70">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Tax Liability</p>
              <h3 className="text-3xl font-bold tracking-tight">₹84,500</h3>
              <div className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Advance paid: ₹42,000</div>
            </GlassCard>

            <GlassCard glowColor="rgba(139, 92, 246, 0.2)">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#8b5cf6]">
                  <AlertCircle size={20} />
                </div>
                <div className="flex items-center text-xs font-medium text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-1 rounded-md border border-[#8b5cf6]/20">
                  <Calendar size={12} className="mr-1" /> Jun 15
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Balance Due</p>
              <h3 className="text-3xl font-bold tracking-tight text-[#8b5cf6]">₹42,500</h3>
              <Button className="w-full mt-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg h-9 text-xs font-semibold shadow-[0_4px_14px_rgba(139,92,246,0.3)]">
                Pay Now
              </Button>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold">Income History</h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Monthly breakdown for FY 24-25</p>
                </div>
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#8b5cf6]">
                  <option className="bg-[#1a0533]">Last 12 Months</option>
                  <option className="bg-[#1a0533]">This Year</option>
                </select>
              </div>
              
              <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 12, 41, 0.9)', 
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                      formatter={(value: number) => [`₹${value},000`, 'Income']}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                    >
                      {monthlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.value > 80 ? '#06b6d4' : 'rgba(6, 182, 212, 0.5)'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Income Sources & Documents */}
            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">Income Sources</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Upwork', amount: '₹5,20,000', type: 'Freelance', color: '#10b981' },
                    { name: 'Swiggy', amount: '₹2,10,000', type: 'Delivery', color: '#f59e0b' },
                    { name: 'Bank Interest', amount: '₹10,000', type: 'Passive', color: '#8b5cf6' },
                  ].map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }}></div>
                        <div>
                          <p className="text-sm font-medium text-white">{source.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{source.type}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{source.amount}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Recent Uploads</h3>
                  <button className="text-[#8b5cf6] text-xs font-medium hover:text-[#7c3aed]">View All</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Upwork_April_2025.pdf', date: 'Today' },
                    { name: 'Swiggy_March_2025.pdf', date: 'Yesterday' },
                    { name: 'Bank_Statement_Q4.pdf', date: '3 days ago' },
                  ].map((doc, idx) => (
                    <div key={idx} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-white/5 text-[#06b6d4]">
                        <FileCheck size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Parsed • {doc.date}</p>
                      </div>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
