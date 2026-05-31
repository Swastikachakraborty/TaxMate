import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, CheckCircle, Calendar, FileText, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const chartData = [
  { name: "Apr", value: 65000 },
  { name: "May", value: 72000 },
  { name: "Jun", value: 58000 },
  { name: "Jul", value: 80000 },
  { name: "Aug", value: 91000 },
  { name: "Sep", value: 63000 },
  { name: "Oct", value: 55000 },
  { name: "Nov", value: 78000 },
  { name: "Dec", value: 84000 },
  { name: "Jan", value: 70000 },
  { name: "Feb", value: 62000 },
  { name: "Mar", value: 62000 },
];

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10 max-w-6xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Good morning, Priya</h1>
        <p className="text-muted-foreground">Here is your financial overview for FY 2024–25.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value="₹8,40,000" icon={TrendingUp} color="text-primary" glow="shadow-primary/20" />
        <StatCard title="Tax Liability" value="₹84,500" icon={IndianRupee} color="text-red-500" glow="shadow-red-500/20" />
        <StatCard title="Advance Tax Paid" value="₹42,000" icon={CheckCircle} color="text-green-500" glow="shadow-green-500/20" />
        <StatCard title="Next Deadline" value="Jun 15, 2025" icon={Calendar} color="text-secondary" glow="shadow-secondary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-card border-border shadow-md">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Monthly Income</h3>
              <p className="text-sm text-muted-foreground">FY 2024–25</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val/1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Income']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-card border-border shadow-md">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { name: "Upwork_April_2025.pdf", platform: "Upwork", date: "Apr 30" },
                { name: "Swiggy_March_2025.pdf", platform: "Swiggy", date: "Mar 31" },
                { name: "Bank_Statement_Q4.pdf", platform: "Bank Statement", date: "Mar 31" }
              ].map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.platform} • {file.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium border border-green-500/20">
                    <Check className="w-3 h-3" />
                    <span>Parsed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, glow }: { title: string, value: string, icon: any, color: string, glow: string }) {
  return (
    <Card className="bg-card border-border shadow-md relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-current opacity-10 rounded-full blur-2xl -mr-10 -mt-10 ${color}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`p-2 rounded-md bg-white/5 border border-white/10 ${color} shadow-[0_0_15px_rgba(0,0,0,0.1)] ${glow}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </CardContent>
    </Card>
  );
}
