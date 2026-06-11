import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/i18n";

interface LanguageSwitcherProps {
  variant?: "nav" | "sidebar";
}

export function LanguageSwitcher({ variant = "nav" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  if (variant === "sidebar") {
    return (
      <div className="px-3 pt-2 pb-1">
        <p className="text-[9px] font-bold text-[#8c8577] uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <Globe className="w-3 h-3" /> Language
        </p>
        <div className="flex gap-1 flex-wrap">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`text-[11px] px-2 py-1 rounded-lg font-medium transition-all ${
                i18n.language === lang.code
                  ? "bg-[#d97706] text-white shadow-sm"
                  : "bg-[#f4ebd9]/40 text-[#6b675d] hover:bg-[#f4ebd9] hover:text-[#1a1a2e]"
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // nav variant — compact dropdown for landing page header
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#e8e2d5] text-sm font-medium text-[#6b675d] hover:text-[#1a1a2e] hover:border-[#d97706]/40 transition-all">
        <Globe className="w-3.5 h-3.5" />
        <span>{current.nativeName}</span>
      </button>
      <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#e8e2d5] rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[130px]">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
              i18n.language === lang.code
                ? "bg-[#f4ebd9] text-[#d97706] font-semibold"
                : "text-[#1a1a2e] hover:bg-[#faf7f2]"
            }`}
          >
            <span>{lang.nativeName}</span>
            {i18n.language === lang.code && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
