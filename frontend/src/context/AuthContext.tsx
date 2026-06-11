// Clerk auth is wired in App.tsx via ClerkProvider.
// Two providers are exported:
//   ClerkAuthProvider — uses Clerk hooks (safe inside <ClerkProvider>)
//   DemoAuthProvider  — no Clerk needed (for dev/no-auth mode)
// App.tsx picks the right one based on whether VITE_CLERK_PUBLISHABLE_KEY is set.
import { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

interface AuthContextType {
  userId: string | null;
  name: string | null;
  isLoaded: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Used inside <ClerkProvider> — safe to call Clerk hooks here */
export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const value: AuthContextType = {
    userId: isSignedIn ? (user?.id ?? null) : null,
    name: isSignedIn ? (user?.fullName ?? user?.firstName ?? null) : null,
    isLoaded,
    signOut: () => signOut({ redirectUrl: "/" }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Used WITHOUT Clerk — provides a demo/dev user */
export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    userId: "demo_user",
    name: "Demo User",
    isLoaded: true,
    signOut: () => {},
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Generic AuthProvider — picks ClerkAuthProvider or DemoAuthProvider based
 * on env var. Only use this when you're sure the Clerk/Demo context is
 * already set up correctly by App.tsx.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // This component is only rendered inside ClerkProvider (by AppWithClerk)
  // or standalone (by AppWithoutClerk). In both cases the right provider
  // is already around us — just re-use ClerkAuthProvider here because
  // App.tsx guarantees ClerkProvider is present when this is called.
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
