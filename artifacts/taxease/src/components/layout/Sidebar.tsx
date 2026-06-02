import { Link, useLocation } from "wouter";
import { LayoutDashboard, UploadCloud, PieChart, MessageSquare, Download, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { name: "Dashboard",     path: "/app",             icon: LayoutDashboard },
  { name: "Upload PDFs",   path: "/app/upload",      icon: UploadCloud },
  { name: "Tax Summary",   path: "/app/tax-summary", icon: PieChart },
  { name: "Chat Assistant",path: "/app/chat",         icon: MessageSquare },
  { name: "ITR Export",    path: "/app/itr-export",  icon: Download },
];

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] h-full shrink-0 border-r border-[#e8e2d5] bg-[#fdfbf7] py-8 px-6 justify-between">
        <div>
          <Link href="/">
            <span className="font-['Playfair_Display'] text-2xl font-bold tracking-tight text-[#1a1a2e] mb-12 block cursor-pointer hover:text-[#d97706] transition-colors">
              TaxEase.
            </span>
          </Link>

          <nav className="space-y-1 mt-4">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== "/app" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors border-l-2 ${
                      isActive
                        ? "bg-[#f4ebd9]/40 text-[#1a1a2e] border-[#d97706]"
                        : "text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 border-transparent"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#d97706]" : ""}`} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="px-3 py-4 rounded-xl bg-[#f4ebd9]/30 border border-[#e8e2d5]">
            <p className="text-[10px] font-semibold text-[#8c8577] uppercase tracking-wider mb-1">Form Status</p>
            <p className="text-sm font-medium text-[#1a1a2e] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#d97706]" />
              ITR-4 Ready
            </p>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">{user?.name ?? "—"}</p>
              <p className="text-xs text-[#8c8577]">FY 2024–25</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-[#8c8577] hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#fdfbf7] border-t border-[#e8e2d5] flex items-center justify-around px-2 z-50">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== "/app" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center justify-center w-14 h-full gap-1 ${isActive ? "text-[#d97706]" : "text-[#8c8577]"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-none">{item.name.split(" ")[0]}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
