import { Link, useLocation } from "wouter";
import { Zap, LayoutDashboard, UploadCloud, PieChart, MessageSquare, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Upload PDFs", path: "/upload", icon: UploadCloud },
    { name: "Tax Summary", path: "/tax-summary", icon: PieChart },
    { name: "Chat Assistant", path: "/chat", icon: MessageSquare },
    { name: "ITR Export", path: "/itr-export", icon: Download },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 h-full backdrop-blur-md bg-white/5 border-r border-border shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">TaxEase</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-card border border-border flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarFallback className="bg-muted text-xs">PS</AvatarFallback>
            <AvatarImage src="https://ui-avatars.com/api/?name=Priya+Sharma&background=222&color=fff" />
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">Priya Sharma</p>
            <p className="text-xs text-muted-foreground">FY 2024–25</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-md bg-background/80 border-t border-border flex items-center justify-around px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center justify-center w-16 h-full ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium leading-none">{item.name.split(' ')[0]}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
