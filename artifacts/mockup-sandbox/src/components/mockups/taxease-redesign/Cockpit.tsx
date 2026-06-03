import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Activity, 
  BarChart3, 
  FileText, 
  Settings, 
  TerminalSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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

const files = [
  { name: 'Upwork_April_2025.pdf', status: 'Parsed', date: '2025-05-01 14:22:01' },
  { name: 'Swiggy_March_2025.pdf', status: 'Parsed', date: '2025-05-01 14:18:44' },
  { name: 'Bank_Statement_Q4.pdf', status: 'Parsed', date: '2025-05-01 10:05:12' },
];

export function Cockpit() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-[#22c55e] selection:text-black">
      {/* Sidebar */}
      <div className="w-12 border-r border-gray-800 flex flex-col items-center py-4 bg-[#0d1117] shrink-0 z-10">
        <div className="mb-8">
          <TerminalSquare className="w-6 h-6 text-[#22c55e]" />
        </div>
        <nav className="flex flex-col gap-6 w-full items-center">
          <div className="relative group cursor-pointer w-full flex justify-center">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#22c55e]" />
            <Activity className="w-5 h-5 text-gray-100" />
          </div>
          <div className="relative group cursor-pointer w-full flex justify-center opacity-50 hover:opacity-100 transition-opacity">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="relative group cursor-pointer w-full flex justify-center opacity-50 hover:opacity-100 transition-opacity">
            <FileText className="w-5 h-5" />
          </div>
        </nav>
        <div className="mt-auto pb-4">
          <Settings className="w-5 h-5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Header / Top Bar */}
        <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-end shrink-0 bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase text-xs mb-1">TaxEase Core</h1>
            <p className="text-xs text-gray-500 font-mono">USER: PRIYA SHARMA // ITR-4 // DL: 15-JUN-2025</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#22c55e] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-[#22c55e] animate-pulse inline-block" />
              SYSTEM ONLINE
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 flex flex-col gap-6">
          
          {/* Top Stats - The 4 Data Terminals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-800 bg-[#0d1117]">
            <div className="p-4 border-r border-b md:border-b-0 border-gray-800 flex flex-col justify-between hover:bg-gray-800/30 transition-colors">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Income</span>
              <span className="text-2xl font-mono text-white">₹8,40,000</span>
            </div>
            <div className="p-4 border-r border-b md:border-b-0 border-gray-800 flex flex-col justify-between hover:bg-gray-800/30 transition-colors">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Tax Liability</span>
              <span className="text-2xl font-mono text-white">₹84,500</span>
            </div>
            <div className="p-4 border-r border-gray-800 flex flex-col justify-between hover:bg-gray-800/30 transition-colors">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Advance Tax</span>
              <span className="text-2xl font-mono text-[#22c55e]">₹42,000</span>
            </div>
            <div className="p-4 flex flex-col justify-between hover:bg-gray-800/30 transition-colors bg-red-950/10">
              <span className="text-[10px] text-red-500/70 uppercase font-bold tracking-widest mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Balance Due
              </span>
              <span className="text-2xl font-mono text-red-500">₹42,500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-2 border border-gray-800 bg-[#0d1117] flex flex-col">
              <div className="border-b border-gray-800 p-3 px-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Income Volume (FY 24-25)</span>
                <span className="text-[10px] text-gray-500 font-mono">1M RESOLUTION</span>
              </div>
              <div className="p-4 flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                      tickFormatter={(val) => `₹${val}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#1f2937', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1f2937', borderRadius: 0, padding: '8px' }}
                      itemStyle={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 12 }}
                      labelStyle={{ color: '#9ca3af', fontSize: 10, marginBottom: '4px', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#0d9488" className="hover:fill-[#22d3ee] transition-colors" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Panel - Data Log */}
            <div className="border border-gray-800 bg-[#0d1117] flex flex-col">
              <div className="border-b border-gray-800 p-3 px-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Input Stream</span>
                <span className="text-[10px] text-[#22c55e] font-mono">3 OK</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {files.map((file, i) => (
                      <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                        <td className="p-3 align-top w-6">
                          <CheckCircle2 className="w-4 h-4 text-[#22c55e] mt-0.5" />
                        </td>
                        <td className="p-3">
                          <div className="text-xs text-gray-300 font-medium mb-1 truncate max-w-[200px]" title={file.name}>
                            {file.name}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-mono">{file.date}</span>
                            <span className="text-[10px] bg-[#22c55e]/10 text-[#22c55e] px-1.5 py-0.5 font-mono uppercase tracking-wider border border-[#22c55e]/20">
                              {file.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Income Breakdown inside right panel */}
              <div className="border-t border-gray-800 p-4 bg-gray-900/20">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Income Vector</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Upwork</span>
                    <span className="text-xs font-mono text-gray-200">₹5,20,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Swiggy</span>
                    <span className="text-xs font-mono text-gray-200">₹2,10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Bank Interest</span>
                    <span className="text-xs font-mono text-gray-200">₹10,000</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
