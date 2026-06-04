import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, DemoAuthProvider } from "@/context/AuthContext";
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

function ProtectedApp() {
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
        <DemoAuthProvider>
          <WouterRouter base="">
            <Switch>
              <Route path="/" component={Landing} />
              {/* Redirect auth routes straight to dashboard in demo mode */}
              <Route path="/sign-in">{() => <Redirect to="/app" />}</Route>
              <Route path="/sign-up">{() => <Redirect to="/app" />}</Route>
              <Route path="/login">{() => <Redirect to="/app" />}</Route>
              <Route path="/register">{() => <Redirect to="/app" />}</Route>
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
                      </Switch>
                    </WouterRouter>
                  </AppLayout>
                )}
              </Route>
              <Route path="/app">
                {() => (
                  <AppLayout>
                    <WouterRouter base="/app">
                      <Switch>
                        <Route path="/" component={Dashboard} />
                      </Switch>
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
    // No Clerk key: bypass auth entirely (demo/local mode)
    return <AppWithoutClerk />;
  }
  return <AppWithClerk />;
}
