import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, User as UserIcon, Settings, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { leadsApi } from "../../api/leads.api";
import { useToastStore } from "../../store/toastStore";

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const handleExport = async () => {
    try {
      const blob = await leadsApi.exportAll({});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leads_export_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      useToastStore.getState().addToast("CSV exported successfully", "success");
    } catch {
      useToastStore.getState().addToast("Export failed. Please try again.", "error");
    }
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/leads", icon: FileText, label: "Leads" },
    { to: "/profile", icon: UserIcon, label: "Profile" },
    ...(user?.role === "admin"
      ? [{ to: "/admin/users", icon: Settings, label: "Users" }]
      : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center pb-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl bg-slate-900/50 dark:bg-slate-950/60 border border-white/10 shadow-2xl">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={label}
              className={[
                "flex items-center gap-2 px-4 h-11 rounded-full text-sm font-medium transition-all duration-200 transform-gpu",
                active
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.2)]"
                  : "text-slate-300 hover:text-white hover:bg-white/10",
              ].join(" ")}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button
              onClick={handleExport}
              title="Export CSV"
              className="flex items-center gap-2 px-4 h-11 rounded-full text-sm font-medium transition-all duration-200 transform-gpu text-emerald-400 hover:text-white hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};
