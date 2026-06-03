import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PERKS = [
  "Free ITR-4 worksheet every year",
  "AI chat assistant included",
  "No credit card required",
  "Built for 44ADA filers",
];

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength =
    password.length === 0 ? 0 :
    password.length < 6 ? 1 :
    password.length < 10 ? 2 : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"][passwordStrength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(name, email, password);
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
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-['Playfair_Display'] text-4xl font-bold text-white leading-tight">
              Start filing<br />
              <span className="text-[#d97706]">smarter today.</span>
            </p>
            <p className="text-white/60 leading-relaxed">
              Join Indian freelancers who've simplified their tax life with TaxEase.
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
              "TaxEase made me realise I'd been overpaying for three years. Got ₹18,000 back!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#d97706]/20 flex items-center justify-center text-xs font-bold text-[#d97706]">RM</div>
              <span className="text-xs text-white/50">Rohan M. · Freelance dev</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/30">© 2025 TaxEase · For Indian freelancers</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
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
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-2">Create your account</h1>
            <p className="text-[#6b675d]">Free forever · No credit card needed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                data-testid="name-input"
                className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] placeholder:text-[#c4b99d] text-sm focus:outline-none focus:border-[#d97706] transition-colors"
              />
            </div>

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
                  placeholder="Minimum 6 characters"
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
              {password.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-1 bg-[#e8e2d5] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${strengthColor}`}
                      animate={{ width: `${(passwordStrength / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#6b675d]">{strengthLabel}</span>
                </div>
              )}
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
              data-testid="register-button"
              className="w-full h-12 rounded-xl bg-[#d97706] hover:bg-[#b46204] disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-xs text-center text-[#8c8577]">
              By signing up you agree to our terms. Your data stays private.
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b675d]">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-[#d97706] font-semibold hover:underline cursor-pointer">Sign in</span>
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
