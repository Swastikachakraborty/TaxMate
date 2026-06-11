import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ClerkProvider, SignedIn, SignedOut, RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkAuthProvider, DemoAuthProvider } from "@/context/AuthContext";
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

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      style={{ height: "100%", overflow: "auto" }}
    >
      {children}
    </motion.div>
  );
}

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

  if (!isLoaded) return <ClerkLoadingScreen />;

  return (
    <>
      <SignedIn>
        <AppLayout>
          <WouterRouter base="/app">
            <InnerAppRoutes />
          </WouterRouter>
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// Separated so AnimatePresence can track route changes
function InnerAppRoutes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/">
          {() => <PageTransition><Dashboard /></PageTransition>}
        </Route>
        <Route path="/upload">
          {() => <PageTransition><Upload /></PageTransition>}
        </Route>
        <Route path="/tax-summary">
          {() => <PageTransition><TaxSummary /></PageTransition>}
        </Route>
        <Route path="/chat">
          {() => <PageTransition><Chat /></PageTransition>}
        </Route>
        <Route path="/itr-export">
          {() => <PageTransition><ItrExport /></PageTransition>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

// No-auth inner routes
function NoAuthAppRoutes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/">
          {() => <PageTransition><Dashboard /></PageTransition>}
        </Route>
        <Route path="/upload">
          {() => <PageTransition><Upload /></PageTransition>}
        </Route>
        <Route path="/tax-summary">
          {() => <PageTransition><TaxSummary /></PageTransition>}
        </Route>
        <Route path="/chat">
          {() => <PageTransition><Chat /></PageTransition>}
        </Route>
        <Route path="/itr-export">
          {() => <PageTransition><ItrExport /></PageTransition>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function Router() {
  const { isLoaded } = useUser();

  if (!isLoaded) return <ClerkLoadingScreen />;

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/sign-in" component={Login} />
      <Route path="/sign-up" component={Register} />
      <Route path="/login">{() => <Redirect to="/sign-in" />}</Route>
      <Route path="/register">{() => <Redirect to="/sign-up" />}</Route>
      <Route path="/itr-export">{() => <Redirect to="/app/itr-export" />}</Route>
      <Route path="/tax-summary">{() => <Redirect to="/app/tax-summary" />}</Route>
      <Route path="/upload">{() => <Redirect to="/app/upload" />}</Route>
      <Route path="/chat">{() => <Redirect to="/app/chat" />}</Route>
      <Route path="/dashboard">{() => <Redirect to="/app" />}</Route>
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
          <ClerkAuthProvider>
            <WouterRouter base="">
              <Router />
            </WouterRouter>
            <Toaster />
          </ClerkAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function AppWithoutClerk() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoAuthProvider>
          <WouterRouter base="">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/app/:rest*">
                {() => (
                  <AppLayout>
                    <WouterRouter base="/app">
                      <NoAuthAppRoutes />
                    </WouterRouter>
                  </AppLayout>
                )}
              </Route>
              <Route path="/app">
                {() => (
                  <AppLayout>
                    <WouterRouter base="/app">
                      <NoAuthAppRoutes />
                    </WouterRouter>
                  </AppLayout>
                )}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </DemoAuthProvider>
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
