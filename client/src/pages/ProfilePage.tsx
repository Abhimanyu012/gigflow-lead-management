import React from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { User, Shield, Mail, Calendar, LogOut } from "lucide-react";
import { formatDate } from "../utils/formatDate";

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Account Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage your profile information and account security.</p>
        </header>

        <div className="space-y-6">
          {/* Hero Section */}
          <section className="glass-heavy p-8 rounded-[32px] border relative overflow-hidden group" style={{ borderColor: "var(--border)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg border border-white/20"
                style={{ 
                  background: user?.role === "admin" ? "var(--accent-orange-muted)" : "var(--accent-muted)", 
                  color: user?.role === "admin" ? "var(--accent-orange)" : "var(--accent)" 
                }}
              >
                {initials}
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold leading-tight" style={{ color: "var(--text)" }}>{user?.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-2)] border" style={{ borderColor: "var(--border)" }}>
                    <Mail className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border" 
                       style={{ 
                         borderColor: user?.role === "admin" ? "rgba(249,115,22,0.3)" : "rgba(20,184,166,0.3)",
                         background: user?.role === "admin" ? "var(--accent-orange-muted)" : "var(--accent-muted)",
                         color: user?.role === "admin" ? "var(--accent-orange)" : "var(--accent)"
                       }}>
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{user?.role} Access</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50" style={{ color: "var(--text-muted)" }}>Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Full Name</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{user?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Email Address</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50" style={{ color: "var(--text-muted)" }}>Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Role</span>
                  <span className="text-sm font-semibold capitalize" style={{ color: "var(--text)" }}>{user?.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-500">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass p-6 rounded-3xl border border-rose-500/10 bg-rose-500/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Danger Zone</h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Sign out of your account on this device.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={logout} 
                className="text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
