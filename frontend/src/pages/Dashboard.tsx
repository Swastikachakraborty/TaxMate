import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { api, type IncomeSummary, type TaxResult, type DeadlinesResult, type UserProfile } from "@/lib/api";

import { AgentChatPanel } from "@/components/chat/AgentChatPanel";
import { RightDashboardPane } from "@/components/widgets/DashboardWidgets";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function Dashboard() {
  const { userId, name, isLoaded } = useAuth();
  const uid = userId ?? "";
  const queryClient = useQueryClient();

  // ── Onboarding State ──
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ── Data Fetching ──
  const userQ = useQuery<UserProfile>({
    queryKey: ["userProfile", uid],
    queryFn: () => api.getUser(uid),
    enabled: !!uid,
    retry: false,
  });

  const isNewUser = !!uid && userQ.isError &&
    ((userQ.error as any)?.message?.toLowerCase().includes("not found") ||
      (userQ.error as any)?.status === 404);

  // Chat is only allowed once we have a confirmed profile in MongoDB
  const profileReady = !!uid && !!userQ.data && !isNewUser;

  // Open onboarding dialog exactly once when we detect a 404 (new user).
  useEffect(() => {
    if (isNewUser && !userQ.isLoading) {
      setShowOnboarding(true);
    }
  }, [isNewUser, userQ.isLoading]);

  const incomeQ = useQuery<IncomeSummary>({
    queryKey: ["income", uid],
    queryFn: () => api.getIncome(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  const taxQ = useQuery<TaxResult>({
    queryKey: ["tax", uid],
    queryFn: () => api.getTax(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  const deadlinesQ = useQuery<DeadlinesResult>({
    queryKey: ["deadlines", uid],
    queryFn: () => api.getDeadlines(uid),
    enabled: !!uid && !isNewUser && !userQ.isLoading,
    retry: false,
  });

  // Don't render until Clerk and user profile are resolved
  if (!isLoaded || (!!userId && userQ.isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8c8577]">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#faf7f2]">

      {/* ── Onboarding Dialog ── */}
      <OnboardingModal 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding} 
        uid={uid} 
        defaultName={name ?? ""} 
      />

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-5 md:px-8 h-14 border-b border-[#e8e2d5] shrink-0 bg-[#fdfbf7]/80 backdrop-blur-sm">
        <div>
          <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-widest">FY 2025–26 · Agent Workspace</span>
          <h1 className="font-['Playfair_Display'] text-lg font-semibold text-[#1a1a2e] leading-none">
            {userQ.data?.name ?? name ?? "GigSaathi"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["income", uid] });
              queryClient.invalidateQueries({ queryKey: ["tax", uid] });
              queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
            }}
            className="w-8 h-8 rounded-lg border border-[#e8e2d5] flex items-center justify-center text-[#8c8577] hover:text-[#d97706] hover:border-[#d97706]/40 transition-all"
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Gemini Agent Active
          </span>
        </div>
      </header>

      {/* ── Main split layout ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Pane — AI Agent Chat */}
        <AgentChatPanel 
          uid={uid}
          profileReady={profileReady}
          showOnboarding={showOnboarding}
          userLoading={userQ.isLoading}
          userName={userQ.data?.name ?? name}
        />

        {/* Right Pane — Live Financial Dashboard */}
        <RightDashboardPane 
          income={incomeQ.data}
          tax={taxQ.data}
          deadlines={deadlinesQ.data}
          deadlinesLoading={deadlinesQ.isLoading}
        />
        
      </div>
    </div>
  );
}
