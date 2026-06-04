import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

const STATES_OF_INDIA = [
  "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Haryana", "Kerala", "Other",
];
const OCCUPATIONS = [
  { value: "freelancer", label: "Freelancer / Professional (Sec 44ADA)" },
  { value: "delivery", label: "Delivery Partner (Swiggy, Zomato, etc.)" },
  { value: "rideshare", label: "Rideshare Driver (Uber, Ola, etc.)" },
  { value: "mixed", label: "Mixed / Multiple Platform Roles" },
];

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uid: string;
  defaultName: string;
}

export function OnboardingModal({ open, onOpenChange, uid, defaultName }: OnboardingModalProps) {
  const queryClient = useQueryClient();
  const [onboardName, setOnboardName] = useState(defaultName);
  const [onboardAge, setOnboardAge] = useState("25");
  const [onboardState, setOnboardState] = useState("Maharashtra");
  const [onboardOcc, setOnboardOcc] = useState("freelancer");
  const [onboardPan, setOnboardPan] = useState("");
  const [onboardError, setOnboardError] = useState("");

  useEffect(() => {
    if (defaultName && !onboardName) {
      setOnboardName(defaultName);
    }
  }, [defaultName, onboardName]);

  const { mutate: submitProfile, isPending: onboardSubmitting } = useMutation({
    mutationFn: (data: any) => api.createUser(data),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile", uid] });
      queryClient.invalidateQueries({ queryKey: ["income", uid] });
      queryClient.invalidateQueries({ queryKey: ["tax", uid] });
      queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
    },
    onError: (err: any) => {
      if ((err.message ?? "").toLowerCase().includes("already exists")) {
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["userProfile", uid] });
      } else {
        setOnboardError(err.message ?? "Something went wrong.");
      }
    }
  });

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) { setOnboardError("Name is required"); return; }
    const age = parseInt(onboardAge);
    if (isNaN(age) || age < 18 || age > 120) { setOnboardError("Enter a valid age (18–120)"); return; }
    setOnboardError("");
    
    submitProfile({
      user_id: uid,
      name: onboardName.trim(),
      state: onboardState,
      occupation_type: onboardOcc,
      age,
      opted_44ADA: true,
      pan_number: onboardPan.trim().toUpperCase() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fdfbf7] border border-[#e8e2d5] rounded-2xl shadow-2xl outline-none" 
        onInteractOutside={(e) => { e.preventDefault(); }} // Prevent closing during onboarding
      >
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a2e] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d97706] animate-pulse" />
            Welcome to GigSaathi
          </DialogTitle>
          <DialogDescription className="text-[#6b675d] text-sm">
            Set up your profile once — GigSaathi will tailor every calculation to you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOnboard} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Your Name</label>
            <input value={onboardName} onChange={e => setOnboardName(e.target.value)}
              placeholder="Priya Sharma" required
              className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">State</label>
              <select value={onboardState} onChange={e => setOnboardState(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]">
                {STATES_OF_INDIA.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Age</label>
              <input type="number" value={onboardAge} onChange={e => setOnboardAge(e.target.value)}
                min="18" max="120" required
                className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">Primary Occupation</label>
            <select value={onboardOcc} onChange={e => setOnboardOcc(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm focus:outline-none focus:border-[#d97706]">
              {OCCUPATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">PAN Number <span className="text-[#8c8577] normal-case font-normal">(optional)</span></label>
            <input value={onboardPan} onChange={e => setOnboardPan(e.target.value)}
              placeholder="ABCDE1234F" maxLength={10}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e8e2d5] bg-white text-[#1a1a2e] text-sm uppercase placeholder:normal-case placeholder:text-[#c4b99d] focus:outline-none focus:border-[#d97706]" />
          </div>
          {onboardError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{onboardError}
            </p>
          )}
          <DialogFooter className="pt-1">
            <button type="submit" disabled={onboardSubmitting}
              className="w-full h-11 rounded-xl bg-[#d97706] hover:bg-[#b46204] text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm">
              {onboardSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting up…</>
                : <>Create Profile &amp; Enter Workspace <ChevronRight className="w-4 h-4" /></>}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
