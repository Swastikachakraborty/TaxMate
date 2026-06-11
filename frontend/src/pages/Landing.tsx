import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, LayoutDashboard, IndianRupee, CheckCircle2, Star, FileText, Scissors, MessageSquare, CalendarClock, FileCheck2, ShieldCheck, Twitter, Instagram, Linkedin } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ── Auth helper ────────────────────────────────────────────────────────────────
function useSignedIn() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isSignedIn, isLoaded } = useUser();
    return isLoaded && !!isSignedIn;
  } catch { return false; }
}

// ── Animated counter ───────────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) val.set(to);
  }, [inView, to, val]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString("en-IN") + suffix;
    });
  }, [spring, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ── Floating rupee sparkles ────────────────────────────────────────────────────
function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], y: -60, scale: [0, 1.2, 0] }}
      transition={{ delay, duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
    >
      <IndianRupee className="w-4 h-4 text-[#d97706]" />
    </motion.div>
  );
}

// ── SVG: Delivery Partner on scooter ──────────────────────────────────────────
function DeliveryGuy() {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Scooter body */}
      <motion.g
        animate={{ x: [0, -3, 0], y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Wheels */}
        <circle cx="55" cy="145" r="18" fill="#1a1a2e" />
        <circle cx="55" cy="145" r="10" fill="#3a3a5e" />
        <circle cx="145" cy="145" r="18" fill="#1a1a2e" />
        <circle cx="145" cy="145" r="10" fill="#3a3a5e" />
        {/* Scooter frame */}
        <rect x="55" y="120" width="90" height="20" rx="10" fill="#d97706" />
        <rect x="100" y="100" width="45" height="22" rx="8" fill="#b46204" />
        <rect x="50" y="108" width="20" height="30" rx="6" fill="#d97706" />
        {/* Handlebar */}
        <rect x="120" y="98" width="30" height="5" rx="2.5" fill="#1a1a2e" />
        <rect x="148" y="90" width="5" height="18" rx="2.5" fill="#1a1a2e" />
        {/* Delivery box */}
        <rect x="58" y="88" width="40" height="30" rx="6" fill="#fdfbf7" stroke="#e8e2d5" strokeWidth="2" />
        <text x="78" y="108" textAnchor="middle" fill="#d97706" fontSize="14" fontWeight="bold">GS</text>
        {/* Rider - body */}
        <ellipse cx="115" cy="85" rx="16" ry="20" fill="#f4ebd9" />
        {/* Helmet */}
        <ellipse cx="115" cy="68" rx="14" ry="12" fill="#1a1a2e" />
        <ellipse cx="115" cy="72" rx="10" ry="6" fill="#d97706" />
        {/* Face */}
        <ellipse cx="115" cy="80" rx="10" ry="9" fill="#e8c99a" />
        {/* Smile */}
        <path d="M110 83 Q115 88 120 83" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <ellipse cx="111" cy="78" rx="1.5" ry="2" fill="#1a1a2e" />
        <ellipse cx="119" cy="78" rx="1.5" ry="2" fill="#1a1a2e" />
        {/* Arm reaching to phone */}
        <path d="M128 90 L148 75" stroke="#e8c99a" strokeWidth="6" strokeLinecap="round" />
      </motion.g>
      {/* Phone with GigSaathi */}
      <motion.g
        animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "155px", originY: "70px" }}
      >
        <rect x="148" y="55" width="24" height="38" rx="4" fill="#1a1a2e" />
        <rect x="150" y="58" width="20" height="30" rx="2" fill="#f4ebd9" />
        <text x="160" y="70" textAnchor="middle" fill="#d97706" fontSize="6" fontWeight="bold">GigS</text>
        <rect x="153" y="73" width="14" height="2" rx="1" fill="#e8e2d5" />
        <rect x="153" y="77" width="10" height="2" rx="1" fill="#e8e2d5" />
        <rect x="153" y="81" width="12" height="2" rx="1" fill="#d97706" />
      </motion.g>
      {/* Exclamation sparkles */}
      <motion.text x="170" y="45" fill="#d97706" fontSize="16" fontWeight="bold"
        animate={{ opacity: [0,1,0], y: [0,-12,0], scale: [0.5,1.2,0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>!</motion.text>
      <motion.text x="183" y="35" fill="#d97706" fontSize="12" fontWeight="bold"
        animate={{ opacity: [0,1,0], y: [0,-10,0], scale: [0.5,1,0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}>✓</motion.text>
    </svg>
  );
}

// ── SVG: Freelancer at laptop ──────────────────────────────────────────────────
function Freelancer() {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Desk */}
      <rect x="20" y="135" width="160" height="12" rx="6" fill="#e8e2d5" />
      <rect x="40" y="147" width="10" height="25" rx="5" fill="#e8e2d5" />
      <rect x="150" y="147" width="10" height="25" rx="5" fill="#e8e2d5" />
      {/* Laptop */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="55" y="90" width="90" height="50" rx="6" fill="#1a1a2e" />
        <rect x="58" y="93" width="84" height="44" rx="4" fill="#f4ebd9" />
        <rect x="40" y="138" width="120" height="8" rx="4" fill="#2d2d4e" />
        {/* Screen content */}
        <rect x="63" y="98" width="74" height="4" rx="2" fill="#d97706" />
        <rect x="63" y="106" width="40" height="2.5" rx="1.5" fill="#e8e2d5" />
        <rect x="63" y="111" width="55" height="2.5" rx="1.5" fill="#e8e2d5" />
        <rect x="63" y="116" width="45" height="2.5" rx="1.5" fill="#e8e2d5" />
        <rect x="63" y="121" width="60" height="6" rx="3" fill="#d97706" />
        <text x="93" y="126" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">Tax Filing Ready!</text>
      </motion.g>
      {/* Person */}
      <ellipse cx="100" cy="70" rx="18" ry="22" fill="#f4ebd9" />
      {/* Hair */}
      <ellipse cx="100" cy="55" rx="18" ry="10" fill="#1a1a2e" />
      <ellipse cx="84" cy="63" rx="5" ry="10" fill="#1a1a2e" />
      <ellipse cx="116" cy="63" rx="5" ry="10" fill="#1a1a2e" />
      {/* Face */}
      <ellipse cx="100" cy="70" rx="14" ry="14" fill="#e8c99a" />
      {/* Big smile */}
      <motion.path d="M92 73 Q100 82 108 73" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" fill="none"
        animate={{ d: ["M92 73 Q100 82 108 73", "M91 72 Q100 84 109 72", "M92 73 Q100 82 108 73"] }}
        transition={{ duration: 2, repeat: Infinity }} />
      {/* Eyes - excited wide */}
      <ellipse cx="93" cy="67" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="107" cy="67" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="94" cy="66" rx="1" ry="1" fill="white" />
      <ellipse cx="108" cy="66" rx="1" ry="1" fill="white" />
      {/* Raised arms */}
      <motion.path d="M83 80 L60 60" stroke="#e8c99a" strokeWidth="7" strokeLinecap="round"
        animate={{ rotate: [-5, 8, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ originX: "83px", originY: "80px" }} />
      <motion.path d="M117 80 L140 60" stroke="#e8c99a" strokeWidth="7" strokeLinecap="round"
        animate={{ rotate: [5, -8, 5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ originX: "117px", originY: "80px" }} />
      {/* Stars flying */}
      {[{x:50,y:45,d:0},{x:155,y:40,d:0.4},{x:42,y:70,d:0.7}].map((s,i) => (
        <motion.text key={i} x={s.x} y={s.y} fontSize="12" fill="#d97706"
          animate={{ opacity:[0,1,0], y:[0,-15,0], rotate:[0,20,0] }}
          transition={{ duration:2, repeat:Infinity, delay:s.d }}>★</motion.text>
      ))}
    </svg>
  );
}

// ── SVG: Rideshare driver giving thumbs up ─────────────────────────────────────
function Driver() {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Car body */}
      <motion.g
        animate={{ x: [0, 2, 0], y: [0, -1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="20" y="115" width="160" height="42" rx="12" fill="#d97706" />
        <path d="M55 115 L75 85 L130 85 L155 115 Z" fill="#b46204" />
        <rect x="78" y="88" width="44" height="26" rx="4" fill="#a8d4f5" />
        {/* Windows */}
        <rect x="80" y="90" width="18" height="20" rx="3" fill="#c8e8ff" opacity="0.8" />
        <rect x="102" y="90" width="18" height="20" rx="3" fill="#c8e8ff" opacity="0.8" />
        {/* Wheels */}
        <circle cx="58" cy="158" r="18" fill="#1a1a2e" /><circle cx="58" cy="158" r="9" fill="#3a3a5e" />
        <circle cx="142" cy="158" r="18" fill="#1a1a2e" /><circle cx="142" cy="158" r="9" fill="#3a3a5e" />
        {/* Door detail */}
        <rect x="25" y="118" width="65" height="30" rx="8" fill="#c17f10" />
        <rect x="98" y="118" width="77" height="30" rx="8" fill="#c17f10" />
        {/* GS logo on car */}
        <circle cx="100" cy="133" r="10" fill="#fdfbf7" />
        <text x="100" y="137" textAnchor="middle" fill="#d97706" fontSize="8" fontWeight="bold">GS</text>
      </motion.g>
      {/* Driver visible through window */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="91" cy="94" rx="8" ry="9" fill="#e8c99a" />
        <ellipse cx="91" cy="88" rx="8" ry="5" fill="#1a1a2e" />
        <path d="M86 97 Q91 102 96 97" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="88" cy="92" rx="1.2" ry="1.5" fill="#1a1a2e" />
        <ellipse cx="94" cy="92" rx="1.2" ry="1.5" fill="#1a1a2e" />
      </motion.g>
      {/* Thumbs up hand out of window */}
      <motion.g
        animate={{ rotate: [-10, 5, -10], y: [0, -4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "165px", originY: "100px" }}
      >
        <ellipse cx="170" cy="100" rx="10" ry="14" fill="#e8c99a" />
        <rect x="162" y="102" width="16" height="8" rx="4" fill="#e8c99a" />
        <ellipse cx="170" cy="92" rx="5" ry="6" fill="#d4a97a" />
      </motion.g>
      {/* Road */}
      <rect x="0" y="170" width="200" height="10" rx="2" fill="#e8e2d5" />
      <motion.rect x="-40" y="173" width="30" height="4" rx="2" fill="white"
        animate={{ x: [-40, 220] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      <motion.rect x="60" y="173" width="30" height="4" rx="2" fill="white"
        animate={{ x: [60, 320] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.7 }} />
    </svg>
  );
}

// ── Ticker items ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🛵  Rahul from Swiggy saved ₹12,400 in TDS refunds",
  "💻  Sneha filed her Upwork ITR-4 in under 10 minutes",
  "🚗  Ajay (Uber driver, Pune) owed ₹0 after 44ADA deduction",
  "📱  Fiverr freelancer Pooja got ₹23,000 back",
  "🛵  Delivery partner Suresh discovered he overpaid for 2 years",
  "📊  1,200+ gig workers calculated their tax this week",
];

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-[#e8e2d5] bg-[#fdfbf7] py-3">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
          <span key={i} className="text-sm text-[#6b675d] font-medium shrink-0">{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Platform pill ──────────────────────────────────────────────────────────────
function PlatformPill({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8e2d5] bg-[#fdfbf7] shadow-sm text-xs font-semibold"
      style={{ color }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </motion.div>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: FileText,
    title: "Upload & done",
    desc: "Just drop your payout screenshots or PDFs. Our AI automatically extracts every transaction so you don't have to type a thing.",
  },
  {
    icon: Scissors,
    title: "Keep 50% tax-free",
    desc: "We automatically apply Section 44ADA for freelancers and drivers, cutting your taxable income in half legally.",
  },
  {
    icon: MessageSquare,
    title: "Ask anything",
    desc: "Confused about taxes? Chat with our assistant in plain English or Hindi. Get instant answers without paying a CA.",
  },
  {
    icon: CalendarClock,
    title: "Never miss a date",
    desc: "We track quarterly advance tax deadlines (June, Sept, Dec, March) and send you friendly reminders so you avoid penalties.",
  },
  {
    icon: FileCheck2,
    title: "Ready for filing",
    desc: "Get a clean, professional computation worksheet instantly. Hand it to your CA or use it to easily file your returns yourself.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    desc: "Your financial data is encrypted and strictly private. We never share or sell your income details to anyone.",
  },
];

// ── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I used to dread tax season. GigSaathi took my PDFs and gave me the exact number I owed in seconds. My CA was genuinely impressed.",
    name: "Priya Sharma",
    role: "Upwork designer · Swiggy partner",
    initials: "PS",
    saving: "Saved ₹18,000",
  },
  {
    quote: "The advance tax planner alone is worth it. I never knew about the quarterly deadlines before — GigSaathi reminded me every single time.",
    name: "Rohan Mehta",
    role: "Freelance developer · 3 platforms",
    initials: "RM",
    saving: "Zero penalty",
  },
  {
    quote: "Finally a tax tool that understands that my income comes from five different apps. Everything just works automatically.",
    name: "Anjali Nair",
    role: "Content creator · Ola partner",
    initials: "AN",
    saving: "Saved ₹9,400",
  },
];

// ── FAQ Component ──────────────────────────────────────────────────────────────
const FAQS = [
  { q: "What is GigSaathi?", a: "GigSaathi is an AI-powered tax assistant built specifically for Indian gig workers, freelancers, and delivery partners. It automatically parses your platform payouts and prepares your ITR-4 worksheet." },
  { q: "Does GigSaathi send my data to the cloud?", a: "Your data is processed securely to generate your tax reports. We use bank-grade encryption and strictly adhere to privacy laws. We never share or sell your data to third parties." },
  { q: "How does the AI remember everything?", a: "You simply upload your payout PDFs, and our Gemini AI extracts the income and deduction numbers, safely storing them in your personal secure dashboard." },
  { q: "Is GigSaathi free to use?", a: "Yes, creating an account and parsing your first few documents is completely free. We have premium plans available for advanced quarterly tax tracking and bulk uploads." },
  { q: "Which platforms does it work with?", a: "GigSaathi works with all major Indian platforms including Swiggy, Zomato, Uber, Ola, Upwork, Fiverr, and standard bank statements." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-[#e8e2d5] bg-[#fdfbf7] rounded-md mb-3 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="font-semibold text-[#1a1a2e]">{q}</span>
        <span className="text-[#d97706] text-xl font-medium ml-4 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-sm text-[#6b675d] leading-relaxed border-t border-[#e8e2d5]/50 pt-4 mt-2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Landing Page ──────────────────────────────────────────────────────────

export default function Landing() {
  const isSignedIn = useSignedIn();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "how", "faq"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1a1a2e] overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-[#faf7f2]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between relative">
          {/* Logo — left */}
          <span className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] tracking-tight">
            GigSaathi<span className="text-[#d97706]">.</span>
          </span>

          {/* Pill nav — absolute center */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-white border border-[#e8e2d5] rounded-full p-1 gap-1 shadow-sm">
            {[
              { id: "features", href: "#features", label: "Features" },
              { id: "how", href: "#how", label: "Process" },
              { id: "faq", href: "#faq", label: "FAQ" },
            ].map(({ id, href, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={href}
                  className={`relative z-10 text-sm font-semibold px-5 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-2 ${
                    isActive ? "text-[#d97706]" : "text-[#6b675d] hover:text-[#d97706]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#f4ebd9]/70 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Right — Dashboard only when signed in, else empty placeholder to balance flex */}
          <div className="w-28 flex justify-end">
            {isSignedIn && (
              <Link href="/app">
                <button className="h-9 px-5 rounded-full bg-[#d97706] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#b46204] transition-all shadow-sm">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>


      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 pt-16 md:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <div>


          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-['Playfair_Display'] text-5xl md:text-6xl xl:text-7xl font-bold text-[#1a1a2e] leading-[1.05] tracking-tight mb-5"
          >
            Tax filing,<br />
            <span className="text-[#d97706]">finally simple.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#6b675d] leading-relaxed mb-8 max-w-lg"
          >
            Stop stressing over scattered income. Drop in your payouts from Swiggy, Uber, or freelance work, and our AI will calculate your taxes and prepare your ITR-4 in minutes.
          </motion.p>

          {/* Platform pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {[
              { label: "Swiggy",    color: "#e8620a" },
              { label: "Uber",      color: "#000000" },
              { label: "Upwork",    color: "#14a800" },
              { label: "Fiverr",    color: "#1dbf73" },
              { label: "Zomato",    color: "#e23744" },
              { label: "Ola",       color: "#f7c900" },
              { label: "Rapido",    color: "#ffd600" },
              { label: "Amazon Flex", color: "#ff9900" },
            ].map((p, i) => <PlatformPill key={p.label} {...p} delay={0.35 + i * 0.05} />)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {isSignedIn ? (
              <Link href="/app">
                <button className="h-12 px-8 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white font-semibold flex items-center gap-2 transition-all shadow-md">
                  Open my Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <button className="h-12 px-8 rounded-full bg-[#1a1a2e] hover:bg-[#2d2d4e] text-white font-semibold flex items-center gap-2 transition-all shadow-md">
                    Start for free <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="h-12 px-8 rounded-full border border-[#e8e2d5] hover:border-[#d97706]/40 hover:bg-[#f4ebd9]/30 font-medium transition-all">
                    Sign in
                  </button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-5 mt-8 text-xs text-[#8c8577]"
          >
            {["No credit card", "Free ITR-4 worksheet", "Section 44ADA optimised"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d97706]" />{t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — animated worker scene */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative"
        >
          {/* Background blob */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4ebd9] to-[#faf7f2] rounded-3xl" />

          {/* Character grid */}
          <div className="relative grid grid-cols-2 gap-4 p-6">
            <div className="col-span-2 flex justify-center">
              <div className="relative w-64 h-44">
                <Freelancer />
                <Sparkle x={20} y={20} delay={0} />
                <Sparkle x={200} y={30} delay={0.8} />
                <Sparkle x={120} y={10} delay={1.4} />
              </div>
            </div>
            <div className="relative w-full h-36">
              <DeliveryGuy />
            </div>
            <div className="relative w-full h-36">
              <Driver />
            </div>
          </div>

          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 bg-white border border-[#e8e2d5] rounded-2xl shadow-lg px-4 py-3"
          >
            <p className="text-[10px] font-bold text-[#8c8577] uppercase tracking-wider">Tax Saved</p>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#d97706]">
              ₹<Counter to={18400} />
            </p>
            <p className="text-[10px] text-[#8c8577]">by Priya this year</p>
          </motion.div>

          {/* Bottom floating card */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -bottom-4 -left-4 bg-white border border-[#e8e2d5] rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1a2e]">ITR-4 Ready</p>
              <p className="text-[10px] text-[#8c8577]">Ajay · 4 min ago</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />


      {/* ── Features Bento Grid ── */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-sm font-semibold text-[#d97706] uppercase tracking-wider mb-3">Features</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1a1a2e] max-w-xl leading-tight">
            Everything you need to file with confidence
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
          
          {/* Box 1: Wide (Upload & done) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="col-span-1 md:col-span-2 rounded-[2rem] border border-[#e8e2d5] bg-[#fdfbf7] p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-[#f4ebd9] text-[#d97706] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] mb-3">Upload & done</h3>
              <p className="text-[#6b675d] leading-relaxed text-sm md:text-base">Just drop your payout screenshots or PDFs. Our AI automatically extracts every transaction so you don't have to type a thing.</p>
            </div>
            
            {/* Animated Graphic: Floating PDFs */}
            <div className="absolute right-[-10%] top-[-10%] bottom-0 w-3/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg viewBox="0 0 200 280" className="w-full h-full drop-shadow-xl">
                <motion.rect x="80" y="40" width="90" height="120" rx="8" fill="white" stroke="#e8e2d5" strokeWidth="2" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <motion.path d="M100 70 h50 M100 95 h30 M100 120 h40" stroke="#d97706" strokeWidth="4" strokeLinecap="round" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                
                <motion.rect x="30" y="100" width="100" height="130" rx="8" fill="white" stroke="#e8e2d5" strokeWidth="2" animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
                <motion.path d="M50 130 h60 M50 160 h40 M50 190 h50" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
              </svg>
            </div>
          </motion.div>

          {/* Box 2: Tall (Keep 50% tax-free) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-1 md:row-span-2 rounded-[2rem] border border-[#e8e2d5] bg-[#1a1a2e] p-8 md:p-10 flex flex-col overflow-hidden relative group text-white"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-[#d97706] flex items-center justify-center mb-6">
                <Scissors className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-white mb-4">Keep 50% tax-free</h3>
              <p className="text-white/70 leading-relaxed text-sm">We automatically apply Section 44ADA for freelancers and drivers, cutting your taxable income in half legally.</p>
            </div>
            
            {/* Animated Graphic: 50% pie chart slice */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-end justify-center pb-0 overflow-hidden pointer-events-none">
               <svg viewBox="0 0 200 200" className="w-full h-[150%] opacity-90 group-hover:opacity-100 transition-opacity duration-500 origin-bottom scale-110">
                  <circle cx="100" cy="120" r="70" fill="#2a2a4e" />
                  <motion.path d="M100 50 A70 70 0 0 1 170 120 L100 120 Z" fill="#d97706" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "100px", originY: "120px" }} />
                  <motion.circle cx="140" cy="70" r="3" fill="white" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                  <motion.circle cx="165" cy="90" r="2" fill="white" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }} />
               </svg>
            </div>
          </motion.div>

          {/* Box 3: Square (Ask anything) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="col-span-1 rounded-[2rem] border border-[#e8e2d5] bg-[#fdfbf7] p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a2e] mb-2">Ask anything</h3>
              <p className="text-[#6b675d] text-sm leading-relaxed max-w-[200px]">Confused about taxes? Chat with our assistant in plain English or Hindi.</p>
            </div>
            {/* Graphic: Chat Bubbles */}
            <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg viewBox="0 0 150 150" className="w-full h-full drop-shadow-md">
                <motion.path d="M40 70 Q40 40 80 40 Q120 40 120 70 Q120 100 80 100 L50 110 L55 85 Q40 80 40 70 Z" fill="#f4ebd9" stroke="#d97706" strokeWidth="2" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                <circle cx="65" cy="70" r="4" fill="#d97706" />
                <circle cx="80" cy="70" r="4" fill="#d97706" />
                <circle cx="95" cy="70" r="4" fill="#d97706" />
              </svg>
            </div>
          </motion.div>

          {/* Box 4: Square (Never miss a date) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="col-span-1 rounded-[2rem] border border-[#e8e2d5] bg-[#fdfbf7] p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a2e] mb-2">Never miss a date</h3>
              <p className="text-[#6b675d] text-sm leading-relaxed max-w-[200px]">We track advance tax deadlines so you avoid penalties.</p>
            </div>
            {/* Graphic: Calendar/Bell */}
            <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none text-[#d97706]">
              <svg viewBox="0 0 150 150" className="w-full h-full drop-shadow-md">
                 <rect x="50" y="50" width="70" height="70" rx="12" fill="#f4ebd9" stroke="#d97706" strokeWidth="2" />
                 <path d="M50 75 h70" stroke="#d97706" strokeWidth="2" />
                 <rect x="65" y="40" width="6" height="20" rx="3" fill="#1a1a2e" />
                 <rect x="100" y="40" width="6" height="20" rx="3" fill="#1a1a2e" />
                 <motion.circle cx="85" cy="100" r="6" fill="#d97706" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              </svg>
            </div>
          </motion.div>

          {/* Box 5: Wide Bottom (Ready for filing) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-3 rounded-[2rem] border border-[#d97706]/30 bg-gradient-to-br from-[#fdfbf7] to-[#f4ebd9]/40 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden relative group"
          >
            <div className="relative z-10 max-w-2xl mb-8 md:mb-0">
              <div className="w-12 h-12 rounded-xl bg-[#d97706]/10 text-[#d97706] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">Ready for filing, securely.</h3>
              <p className="text-[#6b675d] leading-relaxed text-sm md:text-base">Get a clean computation worksheet instantly. Your financial data is encrypted, strictly private, and ready to hand over to your CA or use to file yourself.</p>
            </div>
            
            {/* Graphic: Document with Checkmark shield */}
            <div className="relative z-0 w-full md:w-64 h-48 md:absolute right-10 top-1/2 md:-translate-y-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                 <rect x="60" y="30" width="100" height="140" rx="12" fill="white" stroke="#e8e2d5" strokeWidth="3" />
                 <path d="M80 60 h60 M80 85 h40 M80 110 h60 M80 135 h30" stroke="#f4ebd9" strokeWidth="4" strokeLinecap="round" />
                 
                 <motion.path d="M120 90 L160 110 L160 150 Q160 180 120 190 Q80 180 80 150 L80 110 Z" fill="#1a1a2e" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                 <motion.path d="M100 145 L115 160 L140 125" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }} />
              </svg>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="max-w-6xl mx-auto px-5 py-32 border-t border-[#e8e2d5]">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
          <p className="text-sm font-semibold text-[#d97706] uppercase tracking-wider mb-3">Simple process</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1a1a2e]">From chaos to filed return</h2>
        </motion.div>

        <div className="relative space-y-24 md:space-y-32">
          {/* Animated SVG Path connecting the steps */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#d97706]/10 via-[#d97706]/30 to-transparent -translate-x-1/2" />
          
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative">
            <div className="md:text-right">
              <span className="text-[#d97706] font-['Playfair_Display'] text-6xl font-bold opacity-30 block mb-2">01</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-4">Create your account</h3>
              <p className="text-[#6b675d] text-lg leading-relaxed max-w-md ml-auto">Sign up securely in 30 seconds. No credit card required. We immediately set up your personal, encrypted tax dashboard.</p>
            </div>
            <div className="h-64 md:h-80 bg-[#fdfbf7] rounded-3xl border border-[#e8e2d5] relative overflow-hidden shadow-sm group">
              <div className="absolute inset-0 bg-[#d97706]/5 group-hover:bg-[#d97706]/10 transition-colors" />
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                <motion.rect x="70" y="40" width="60" height="120" rx="10" fill="white" stroke="#1a1a2e" strokeWidth="4" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <circle cx="100" cy="55" r="4" fill="#1a1a2e" />
                <rect x="80" y="70" width="40" height="8" rx="4" fill="#e8e2d5" />
                <rect x="80" y="90" width="40" height="25" rx="4" fill="#d97706" />
                <rect x="80" y="125" width="40" height="8" rx="4" fill="#e8e2d5" />
                <rect x="80" y="140" width="40" height="8" rx="4" fill="#e8e2d5" />
                {/* Finger tap */}
                <motion.circle cx="100" cy="102" r="6" fill="#1a1a2e" opacity="0.3" animate={{ scale: [1, 2, 1], opacity: [0, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
              </svg>
            </div>
            <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-[#d97706] border-4 border-[#faf7f2] -translate-x-1/2 -translate-y-1/2 shadow-sm z-10" />
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative">
            <div className="md:order-last">
              <span className="text-[#d97706] font-['Playfair_Display'] text-6xl font-bold opacity-30 block mb-2">02</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-4">Drop in your payouts</h3>
              <p className="text-[#6b675d] text-lg leading-relaxed max-w-md">Upload payout screenshots or PDFs from Swiggy, Uber, Upwork, or any bank. Our AI reads everything instantly.</p>
            </div>
            <div className="h-64 md:h-80 bg-[#fdfbf7] rounded-3xl border border-[#e8e2d5] relative overflow-hidden shadow-sm group md:order-first">
              <div className="absolute inset-0 bg-[#d97706]/5 group-hover:bg-[#d97706]/10 transition-colors" />
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                <motion.path d="M50 160 L150 160 L130 90 L70 90 Z" fill="#f4ebd9" stroke="#d97706" strokeWidth="4" strokeLinejoin="round" />
                <motion.rect x="80" y="30" width="40" height="50" rx="4" fill="white" stroke="#1a1a2e" strokeWidth="4" animate={{ y: [-40, 20], opacity: [0, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }} />
                <motion.path d="M88 45 h24 M88 55 h16" stroke="#d97706" strokeWidth="3" strokeLinecap="round" animate={{ y: [-40, 20], opacity: [0, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }} />
                <motion.path d="M40 160 L160 160 L140 110 L60 110 Z" fill="white" stroke="#d97706" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-[#d97706] border-4 border-[#faf7f2] -translate-x-1/2 -translate-y-1/2 shadow-sm z-10" />
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative">
            <div className="md:text-right">
              <span className="text-[#d97706] font-['Playfair_Display'] text-6xl font-bold opacity-30 block mb-2">03</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-4">Review your breakdown</h3>
              <p className="text-[#6b675d] text-lg leading-relaxed max-w-md ml-auto">See exactly what you earned across all apps. We automatically apply the Section 44ADA deduction to halve your taxable income.</p>
            </div>
            <div className="h-64 md:h-80 bg-[#1a1a2e] rounded-3xl border border-[#e8e2d5] relative overflow-hidden shadow-sm group">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                {/* Mini dashboard */}
                <rect x="40" y="40" width="120" height="120" rx="8" fill="#2a2a4e" />
                <rect x="50" y="50" width="100" height="15" rx="4" fill="#3a3a5e" />
                
                <motion.rect x="50" y="140" width="15" height="10" rx="2" fill="#d97706" animate={{ height: [10, 40, 10], y: [0, -30, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                <motion.rect x="75" y="140" width="15" height="10" rx="2" fill="#e8c99a" animate={{ height: [10, 60, 10], y: [0, -50, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
                <motion.rect x="100" y="140" width="15" height="10" rx="2" fill="#d97706" animate={{ height: [10, 30, 10], y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
                
                {/* 50% badge */}
                <motion.circle cx="130" cy="90" r="20" fill="#d97706" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <text x="130" y="94" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">50%</text>
              </svg>
            </div>
            <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-[#d97706] border-4 border-[#faf7f2] -translate-x-1/2 -translate-y-1/2 shadow-sm z-10" />
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative">
            <div className="md:order-last">
              <span className="text-[#d97706] font-['Playfair_Display'] text-6xl font-bold opacity-30 block mb-2">04</span>
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a2e] mb-4">Download & file securely</h3>
              <p className="text-[#6b675d] text-lg leading-relaxed max-w-md">Generate a clean, ready-to-file ITR-4 worksheet. Hand it straight to your CA, or use it to file your own return confidently.</p>
            </div>
            <div className="h-64 md:h-80 bg-gradient-to-br from-[#fdfbf7] to-[#f4ebd9]/40 rounded-3xl border border-[#d97706]/30 relative overflow-hidden shadow-sm group md:order-first">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                <motion.rect x="65" y="30" width="70" height="100" rx="6" fill="white" stroke="#e8e2d5" strokeWidth="3" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <path d="M80 50 h40 M80 65 h25" stroke="#e8e2d5" strokeWidth="3" strokeLinecap="round" />
                <motion.path d="M85 95 L95 105 L115 80" fill="none" stroke="#d97706" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                
                {/* Download arrow */}
                <motion.path d="M100 140 v30 M90 160 l10 10 l10 -10 M80 180 h40" fill="none" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              </svg>
            </div>
            <div className="hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-[#d97706] border-4 border-[#faf7f2] -translate-x-1/2 -translate-y-1/2 shadow-sm z-10" />
          </div>

        </div>
      </section>



      {/* ── FAQ Section ── */}
      <section id="faq" className="max-w-3xl mx-auto px-5 py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1a1a2e]">Common Inquiries</h2>
        </motion.div>
        
        <div className="flex flex-col">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <FAQItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a1a2e] pt-20 pb-8 mt-10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Branding & Socials */}
            <div className="col-span-1 md:col-span-2">
              <span className="font-['Playfair_Display'] text-3xl font-bold text-white tracking-tight block mb-4">
                GigSaathi<span className="text-[#d97706]">.</span>
              </span>
              <p className="text-white/60 leading-relaxed max-w-sm mb-6">
                The smartest way for Indian gig workers to calculate taxes, claim Section 44ADA benefits, and file ITR-4 effortlessly.
              </p>
              <div className="flex items-center gap-3">
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#d97706] hover:text-[#d97706] transition-all">
                   <Twitter className="w-4 h-4" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#d97706] hover:text-[#d97706] transition-all">
                   <Instagram className="w-4 h-4" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#d97706] hover:text-[#d97706] transition-all">
                   <Linkedin className="w-4 h-4" />
                 </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-5 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#how" className="text-white/60 hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="text-white/60 hover:text-white transition-colors">Features</a></li>
                <li><a href="#faq" className="text-white/60 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Quick Action */}
            <div>
              <h4 className="font-bold text-white mb-5 uppercase text-xs tracking-widest">Get Started</h4>
              <p className="text-white/60 text-sm mb-5">Calculate your exact taxes in under 5 minutes.</p>
              {isSignedIn ? (
                <Link href="/app">
                  <button className="h-10 px-6 rounded-full bg-[#d97706] hover:bg-[#b46204] text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="h-10 px-6 rounded-full bg-white hover:bg-[#f4ebd9] text-[#1a1a2e] font-bold text-sm transition-all shadow-sm">
                    Create free account
                  </button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <IndianRupee className="w-3.5 h-3.5 text-[#d97706]" />
              <span className="font-semibold text-white/60">Optimised for Section 44ADA</span>
              <span className="mx-2 text-white/20">|</span>
              <span>© 2025 GigSaathi. Not a CA firm.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-white/40 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
