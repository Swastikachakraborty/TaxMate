// Clerk auth is wired in App.tsx via ClerkProvider.
// This context wraps Clerk's useUser hook to expose the user_id (Clerk's userId)
// for API calls, plus the user's display name.
import { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

interface AuthContextType {
  userId: string | null;
  name: string | null;
  isLoaded: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
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

/**
 * Demo auth provider for running without Clerk.
 * Reads userId/name from localStorage so the local registration form
 * can persist a real identity without needing Clerk.
 * Falls back to "demo_user" / "Demo User" if nothing is stored yet.
 */
export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const storedId   = localStorage.getItem("demo_user_id");
  const storedName = localStorage.getItem("demo_user_name");

  const value: AuthContextType = {
    userId: storedId,
    name: storedName,
    isLoaded: true,
    signOut: () => {
      localStorage.removeItem("demo_user_id");
      localStorage.removeItem("demo_user_name");
      window.location.href = "/";
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
