import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex">
      {/* Left editorial panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-[#1a1a2e] px-12 py-14">
        <Link href="/">
          <span className="font-['Playfair_Display'] text-2xl font-bold text-white cursor-pointer hover:text-[#d97706] transition-colors">
            TaxEase.
          </span>
        </Link>
        <div className="space-y-6">
          <p className="font-['Playfair_Display'] text-4xl font-bold text-white leading-tight">
            Your taxes,<br />
            <span className="text-[#d97706]">perfectly clear.</span>
          </p>
          <p className="text-white/60 leading-relaxed">
            Sign in to your TaxEase dashboard and pick up right where you left off.
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
        <p className="text-xs text-white/30">© 2025 TaxEase · For Indian freelancers</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <Link href="/">
          <span className="lg:hidden font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] mb-10 block cursor-pointer">
            TaxEase.
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-2">Welcome back</h1>
            <p className="text-[#6b675d]">Sign in to your TaxEase account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                data-testid="email-input"
                className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] placeholder:text-[#c4b99d] text-sm focus:outline-none focus:border-[#d97706] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-testid="password-input"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] placeholder:text-[#c4b99d] text-sm focus:outline-none focus:border-[#d97706] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8577] hover:text-[#1a1a2e] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="login-button"
              className="w-full h-12 rounded-xl bg-[#d97706] hover:bg-[#b46204] disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b675d]">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-[#d97706] font-semibold hover:underline cursor-pointer">Create one free</span>
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#f4ebd9]/40 border border-[#e8e2d5] text-center">
            <p className="text-xs text-[#8c8577] mb-1 font-medium">Try with any credentials</p>
            <p className="text-xs text-[#6b675d]">priya@taxease.in · any password</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
