import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative min-h-0 flex flex-col">
        {/* Content area — scrollable on mobile, layout-controlled on desktop */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden md:h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
