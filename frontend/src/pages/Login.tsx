import { Link } from "wouter";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex">
      {/* Left editorial panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[#1a1a2e] px-12 py-14">
        <Link href="/">
          <span className="font-['Playfair_Display'] text-2xl font-bold text-white cursor-pointer hover:text-[#d97706] transition-colors">
            GigSaathi.
          </span>
        </Link>
        <div className="space-y-6">
          <p className="font-['Playfair_Display'] text-4xl font-bold text-white leading-tight">
            Your taxes,<br />
            <span className="text-[#d97706]">perfectly clear.</span>
          </p>
          <p className="text-white/60 leading-relaxed">
            Sign in to your GigSaathi dashboard and pick up right where you left off.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "44ADA presumptive tax optimised",
              "ITR-4 worksheet in one click",
              "Advance tax reminders built in",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/30">© 2025 GigSaathi · For Indian freelancers</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
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
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
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
