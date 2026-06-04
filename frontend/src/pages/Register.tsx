import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const PERKS = [
  "Free ITR-4 worksheet every year",
  "AI chat assistant included",
  "No credit card required",
  "Built for 44ADA filers",
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const OCCUPATIONS = [
  { value: "freelancer", label: "Freelancer / Consultant" },
  { value: "delivery",   label: "Delivery Partner (Swiggy/Zomato)" },
  { value: "rideshare",  label: "Ride Share Driver (Uber/Ola)" },
  { value: "mixed",      label: "Multiple Platforms / Mixed" },
];

/** Local registration form shown when Clerk is not configured. */
function LocalRegisterForm() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    state: "Karnataka",
    occupation_type: "freelancer",
    opted_44ADA: true,
    pan_number: "",
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Please enter your name."); return; }
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 18 || age > 99) {
      setError("Please enter a valid age (18–99).");
      return;
    }

    setLoading(true);
    try {
      // Generate a stable user_id from the name
      const userId = form.name.trim().toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString(36);

      await api.createUser({
        user_id: userId,
        name: form.name.trim(),
        age,
        state: form.state,
        occupation_type: form.occupation_type,
        opted_44ADA: form.opted_44ADA,
        pan_number: form.pan_number.trim() || undefined,
      });

      // Persist identity so DemoAuthProvider picks it up
      localStorage.setItem("demo_user_id",   userId);
      localStorage.setItem("demo_user_name", form.name.trim());

      // Navigate into the app (full page reload so DemoAuthProvider re-reads localStorage)
      window.location.href = "/app";
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      <div>
        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e]">Create account</h2>
        <p className="text-sm text-[#6b675d] mt-1">Set up your GigSaathi profile to get started.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#1a1a2e]">Full Name</label>
        <input
          type="text"
          placeholder="e.g. Ravi Kumar"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] text-sm placeholder:text-[#c4b99d] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
        />
      </div>

      {/* Age + State row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1a1a2e]">Age</label>
          <input
            type="number"
            min={18} max={99}
            placeholder="e.g. 28"
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] text-sm placeholder:text-[#c4b99d] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1a1a2e]">State</label>
          <select
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
          >
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Occupation */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#1a1a2e]">Occupation Type</label>
        <select
          value={form.occupation_type}
          onChange={(e) => set("occupation_type", e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
        >
          {OCCUPATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* PAN (optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#1a1a2e]">PAN Number <span className="font-normal text-[#8c8577]">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. ABCDE1234F"
          maxLength={10}
          value={form.pan_number}
          onChange={(e) => set("pan_number", e.target.value.toUpperCase())}
          className="w-full h-12 px-4 rounded-xl border border-[#e8e2d5] bg-[#fdfbf7] text-[#1a1a2e] text-sm font-mono placeholder:text-[#c4b99d] placeholder:font-sans focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
        />
      </div>

      {/* 44ADA toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => set("opted_44ADA", !form.opted_44ADA)}
          className={`w-10 h-6 rounded-full transition-colors relative ${form.opted_44ADA ? "bg-[#d97706]" : "bg-[#e8e2d5]"}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.opted_44ADA ? "left-5" : "left-1"}`} />
        </div>
        <span className="text-sm text-[#1a1a2e]">
          Opt into <strong>Section 44ADA</strong> presumptive taxation
          <span className="block text-xs text-[#8c8577] font-normal">Recommended for most gig workers — 50% deduction on gross income</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-[#d97706] hover:bg-[#b46204] disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create Account →"}
      </button>

      <p className="text-center text-sm text-[#8c8577]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#d97706] font-semibold hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

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
          <LocalRegisterForm />
        </motion.div>
      </div>
    </div>
  );
}
