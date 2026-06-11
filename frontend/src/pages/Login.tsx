import { SignIn } from "@clerk/clerk-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";

const APPEARANCE = {
  elements: {
    cardBox:                      "shadow-none bg-transparent border-none w-full",
    card:                         "shadow-none bg-transparent border-none p-0 w-full",
    headerTitle:                  "font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e]",
    headerSubtitle:               "text-[#6b675d] text-sm",
    socialButtonsBlockButton:     "border border-[#e8e2d5] hover:bg-[#f4ebd9]/40 rounded-xl h-11 text-sm font-medium transition-all",
    formButtonPrimary:            "bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white rounded-xl h-12 font-semibold text-sm transition-all border-none",
    formFieldInput:               "h-12 px-4 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] placeholder:text-[#c4b99d] text-sm focus:outline-none focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 transition-all",
    formFieldLabel:               "text-xs font-bold text-[#1a1a2e] uppercase tracking-wider",
    footerActionLink:             "text-[#d97706] font-semibold hover:underline",
    footerActionText:             "text-[#6b675d] text-sm",
    dividerLine:                  "bg-[#e8e2d5]",
    dividerText:                  "text-[#8c8577] text-xs",
    identityPreviewText:          "text-[#1a1a2e]",
    identityPreviewEditButtonIcon:"text-[#d97706]",
    formResendCodeLink:           "text-[#d97706] hover:underline",
    otpCodeFieldInput:            "border-[#e8e2d5] focus:border-[#d97706] rounded-xl",
  },
  variables: {
    colorPrimary:        "#d97706",
    colorText:           "#1a1a2e",
    colorTextSecondary:  "#6b675d",
    colorBackground:     "#ffffff",
    colorInputBackground:"#ffffff",
    colorBorder:         "#e8e2d5",
    borderRadius:        "12px",
    fontFamily:          "'Inter', sans-serif",
    spacingUnit:         "16px",
  },
};

export default function Login() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-5 relative overflow-hidden">

      {/* Subtle background circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d97706]/5 rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#d97706]/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] cursor-pointer hover:text-[#d97706] transition-colors">
              GigSaathi.
            </span>
          </Link>
          <p className="text-sm text-[#8c8577] mt-1.5">Your tax, simplified.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e2d5] rounded-3xl shadow-sm p-8">
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            forceRedirectUrl="/app"
            appearance={APPEARANCE}
          />
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-[#8c8577]">
          <IndianRupee className="w-3 h-3 text-[#d97706]" />
          Built for India's gig workers · Section 44ADA optimised
        </div>
      </motion.div>
    </div>
  );
}
