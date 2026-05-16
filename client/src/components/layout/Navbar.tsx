import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useThemeStore } from "../../store/themeStore";
import { Moon, Sun, LogOut, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const pageTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/profile": "Profile",
  "/admin/users": "User Management",
  "/unauthorized": "Access Denied",
};

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="shrink-0 flex items-center h-16 px-6 border-b glass relative z-50">
      {/* Brand logo */}
      <div 
        className="flex items-center gap-3 group cursor-pointer" 
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-500 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>
          GigFlow
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-colors hover:bg-[var(--surface-2)]"
          style={{ color: "var(--text-muted)" }}
          title="Toggle Theme"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* User Profile - Standard Horizontal Layout */}
        <div className="flex items-center gap-3 border-l pl-6" style={{ borderColor: "var(--border)" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
            style={{
              background: user?.role === "admin" ? "var(--accent-orange-muted)" : "var(--accent-muted)",
              color: user?.role === "admin" ? "var(--accent-orange)" : "var(--accent)",
            }}
          >
            {initials}
          </div>
          
          <div className="hidden sm:flex flex-col">
            <span className="text-[15px] font-bold leading-tight" style={{ color: "var(--text)" }}>
              {user?.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${user?.role === "admin" ? "bg-orange-500" : "bg-teal-500"}`} />
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60" style={{ color: "var(--text-muted)" }}>
                {user?.role} Role
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl transition-all hover:bg-rose-500/10 hover:text-rose-500 active:scale-95"
          style={{ color: "var(--text-muted)" }}
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
