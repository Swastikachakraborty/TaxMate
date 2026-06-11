import { Link, useLocation } from "wouter";
import { LayoutDashboard, UploadCloud, PieChart, Download, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Sidebar() {
  const [location] = useLocation();
  const { name, signOut } = useAuth();
  const { t } = useTranslation();

  const NAV = [
    { name: t("nav.agentWorkspace"), path: "/",            icon: LayoutDashboard },
    { name: t("nav.uploadPdfs"),     path: "/upload",      icon: UploadCloud },
    { name: t("nav.taxSummary"),     path: "/tax-summary", icon: PieChart },
    { name: t("nav.itrExport"),      path: "/itr-export",  icon: Download },
  ];

  function handleLogout() {
    signOut();
    window.location.href = "/";
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] h-full shrink-0 border-r border-[#e8e2d5] bg-[#fdfbf7] py-8 px-6 justify-between">
        <div>
          <a href="/">
            <span className="font-['Playfair_Display'] text-2xl font-bold tracking-tight text-[#1a1a2e] mb-12 block cursor-pointer hover:text-[#d97706] transition-colors">
              GigSaathi.
            </span>
          </a>

          <nav className="space-y-1 mt-4">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors border-l-2 ${
                    isActive
                      ? "bg-[#f4ebd9]/40 text-[#1a1a2e] border-[#d97706]"
                      : "text-[#6b675d] hover:text-[#1a1a2e] hover:bg-[#f4ebd9]/20 border-transparent"
                  }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#d97706]" : ""}`} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          {/* Language Switcher */}
          <LanguageSwitcher variant="sidebar" />

          <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-[#f4ebd9]/30 border border-[#e8e2d5]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#d97706]/10 border border-[#d97706]/20 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-[#d97706]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a1a2e] truncate">{name ?? "—"}</p>
                <p className="text-[10px] text-[#8c8577]">{t("nav.fy")}</p>
              </div>
            </div>
            <button onClick={handleLogout} title={t("common.signOut")}
              className="p-1.5 rounded-lg text-[#8c8577] hover:text-red-400 hover:bg-red-50 transition-colors shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#fdfbf7] border-t border-[#e8e2d5] flex items-center justify-around px-2 z-50">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
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
