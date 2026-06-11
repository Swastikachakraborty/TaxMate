import { Link, useLocation } from "wouter";
import { LayoutDashboard, UploadCloud, PieChart, Download, MessageSquare, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { name: "Dashboard",         hindi: "आय सारांश",    path: "/app",            icon: LayoutDashboard },
  { name: "Upload Documents",  hindi: "दस्तावेज़ अपलोड", path: "/app/upload",      icon: UploadCloud },
  { name: "Tax Summary",       hindi: "टैक्स विवरण",  path: "/app/tax-summary", icon: PieChart },
  { name: "AI Tax Chat",       hindi: "AI सहायक",      path: "/app/chat",        icon: MessageSquare },
  { name: "ITR Export",        hindi: "ITR डाउनलोड",   path: "/app/itr-export",  icon: Download },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { name, signOut } = useAuth();

  function isActive(path: string) {
    const loc = window.location.pathname;
    if (path === "/app") return loc === "/app" || loc === "/app/";
    return loc.startsWith(path);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] h-full shrink-0 border-r border-[#e8e2d5] bg-[#fdfbf7] py-8 px-4 justify-between">
        <div>
          <a href="/">
            <span className="font-['Playfair_Display'] text-2xl font-bold tracking-tight text-[#1a1a2e] mb-10 block cursor-pointer hover:text-[#d97706] transition-colors px-2">
              GigSaathi.
            </span>
          </a>

          <nav className="space-y-0.5 mt-4">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border-l-2 ${
                      active
                        ? "bg-[#f4ebd9]/60 text-[#1a1a2e] border-[#d97706] shadow-sm"
                        : "text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/30 border-transparent"
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#d97706]" : ""}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{item.name}</p>
                      <p className={`text-[10px] leading-tight mt-0.5 ${active ? "text-[#b46204]" : "text-[#c4b99d]"}`}>
                        {item.hindi}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-[#f4ebd9]/30 border border-[#e8e2d5]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-[#d97706]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#1a1a2e] truncate">{name ?? "—"}</p>
                <p className="text-[10px] text-[#8c8577]">FY 2025–26</p>
              </div>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 rounded-lg text-[#8c8577] hover:text-red-400 hover:bg-red-50 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#fdfbf7]/95 backdrop-blur-sm border-t border-[#e8e2d5] flex items-center justify-around px-1 z-50">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex flex-col items-center justify-center w-14 h-full gap-0.5 transition-colors ${
                  active ? "text-[#d97706]" : "text-[#8c8577]"
                }`}
              >
                <div className={`w-8 h-6 flex items-center justify-center rounded-lg transition-all ${active ? "bg-[#f4ebd9]" : ""}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold leading-none">{item.name.split(" ")[0]}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
