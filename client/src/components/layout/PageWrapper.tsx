import React from "react";
import { BottomNav } from "./BottomNav";
import { Navbar } from "./Navbar";

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 overflow-y-auto relative pointer-events-auto">
        <div className="max-w-6xl mx-auto px-5 sm:px-7 py-7 pb-32">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
};
