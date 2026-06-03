import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ClerkProvider, SignedIn, SignedOut, RedirectToSignIn,
  useUser, useClerk,
} from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import TaxSummary from "@/pages/TaxSummary";
import Chat from "@/pages/Chat";
import ItrExport from "@/pages/ItrExport";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// Full-page loading spinner shown while Clerk initializes
function ClerkLoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#faf7f2]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
        <p className="text-sm text-[#8c8577] font-medium">Loading…</p>
      </div>
    </div>
  );
}

function ProtectedApp() {
  const { isLoaded } = useUser();

  // While Clerk is initializing, show loading screen instead of flashing
  if (!isLoaded) return <ClerkLoadingScreen />;

  return (
    <>
      <SignedIn>
        <AppLayout>
          <WouterRouter base="/app">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/upload" component={Upload} />
              <Route path="/tax-summary" component={TaxSummary} />
              <Route path="/chat" component={Chat} />
              <Route path="/itr-export" component={ItrExport} />
              <Route component={NotFound} />
            </Switch>
          </WouterRouter>
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function Router() {
  const { isLoaded } = useUser();

  // Wait for Clerk before rendering any route — prevents flash of wrong content
  if (!isLoaded) return <ClerkLoadingScreen />;

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/sign-in" component={Login} />
      <Route path="/sign-up" component={Register} />
      <Route path="/login">{() => <Redirect to="/sign-in" />}</Route>
      <Route path="/register">{() => <Redirect to="/sign-up" />}</Route>
      <Route path="/app/:rest*" component={ProtectedApp} />
      <Route path="/app" component={ProtectedApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppWithClerk() {
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base="">
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function AppWithoutClerk() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="">
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/app/:rest*">
              {() => (
                <AppLayout>
                  <WouterRouter base="/app">
                    <Switch>
                      <Route path="/" component={Dashboard} />
                      <Route path="/upload" component={Upload} />
                      <Route path="/tax-summary" component={TaxSummary} />
                      <Route path="/chat" component={Chat} />
                      <Route path="/itr-export" component={ItrExport} />
                      <Route component={NotFound} />
                    </Switch>
                  </WouterRouter>
                </AppLayout>
              )}
            </Route>
            <Route path="/app" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  if (!CLERK_KEY) {
    return <AppWithoutClerk />;
  }
  return <AppWithClerk />;
}
