import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SignUp } from "@clerk/clerk-react";

const PERKS = [
  "Free ITR-4 worksheet every year",
  "AI chat assistant included",
  "No credit card required",
  "Built for 44ADA filers",
];

export default function Register() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex">
      {/* Left editorial panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[#1a1a2e] px-12 py-14">
        <Link href="/">
          <span className="font-['Playfair_Display'] text-2xl font-bold text-white cursor-pointer hover:text-[#d97706] transition-colors">
            GigSaathi.
          </span>
        </Link>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-['Playfair_Display'] text-4xl font-bold text-white leading-tight">
              Start filing<br />
              <span className="text-[#d97706]">smarter today.</span>
            </p>
            <p className="text-white/60 leading-relaxed">
              Join Indian freelancers who've simplified their tax life with GigSaathi.
            </p>
          </div>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#d97706] shrink-0" />
                {p}
              </div>
            ))}
          </div>
          {/* Mini testimonial */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <p className="text-sm text-white/70 italic leading-relaxed">
              "GigSaathi made me realise I'd been overpaying for three years. Got ₹18,000 back!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#d97706]/20 flex items-center justify-center text-xs font-bold text-[#d97706]">RM</div>
              <span className="text-xs text-white/50">Rohan M. · Freelance dev</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/30">© 2025 GigSaathi · For Indian freelancers</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <Link href="/">
          <span className="lg:hidden font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] mb-10 block cursor-pointer">
            GigSaathi.
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center"
        >
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
            forceRedirectUrl="/app"
            appearance={{
              elements: {
                cardBox: "shadow-none bg-transparent border-none w-full max-w-md",
                card: "shadow-none bg-transparent border-none p-0 w-full",
                headerTitle: "font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e]",
                headerSubtitle: "text-[#6b675d] text-sm",
                socialButtonsIconButton: "border-[#e8e2d5] hover:bg-[#f4ebd9]/20",
                formButtonPrimary: "bg-[#d97706] hover:bg-[#b46204] text-white rounded-xl h-12 font-semibold text-sm transition-colors border-none",
                formFieldInput: "h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] placeholder:text-[#c4b99d] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors",
                footerActionLink: "text-[#d97706] font-semibold hover:underline",
                identityPreviewText: "text-[#1a1a2e]",
                identityPreviewEditButtonIcon: "text-[#d97706]",
                formResendCodeLink: "text-[#d97706] hover:underline",
                otpCodeFieldInput: "border-[#e8e2d5] focus:border-[#d97706]",
              },
              variables: {
                colorPrimary: "#d97706",
                colorText: "#1a1a2e",
                colorTextSecondary: "#6b675d",
                colorBackground: "#fdfbf7",
                colorInputBackground: "#fdfbf7",
                colorBorder: "#e8e2d5",
                borderRadius: "12px",
                fontFamily: "'Inter', sans-serif",
              }
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
