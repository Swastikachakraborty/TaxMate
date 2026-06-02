import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import TaxSummary from "@/pages/TaxSummary";
import Chat from "@/pages/Chat";
import ItrExport from "@/pages/ItrExport";

const queryClient = new QueryClient();

function ProtectedApp() {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return (
    <AppLayout>
      <Switch>
        <Route path="/app" component={Dashboard} />
        <Route path="/app/upload" component={Upload} />
        <Route path="/app/tax-summary" component={TaxSummary} />
        <Route path="/app/chat" component={Chat} />
        <Route path="/app/itr-export" component={ItrExport} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuth();
  if (user) return <Redirect to="/app" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login">{() => <PublicRoute component={Login} />}</Route>
      <Route path="/register">{() => <PublicRoute component={Register} />}</Route>
      <Route path="/app/:rest*" component={ProtectedApp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
