import React from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { LeadStats } from "../features/leads/LeadStats";
import { useLeads } from "../hooks/useLeads";
import { useEffect, useState } from "react";
import useStats from "../hooks/useStats";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const statusVariant = (s: string): "new" | "contacted" | "qualified" | "lost" | "default" => {
  const m: Record<string, "new" | "contacted" | "qualified" | "lost"> = {
    New: "new", Contacted: "contacted", Qualified: "qualified", Lost: "lost",
  };
  return m[s] ?? "default";
};

const staticPipelineColors: Record<string, string> = {
  New: "var(--accent)", // Teal
  Contacted: "#38bdf8", // Sky blue
  Qualified: "var(--accent-orange)", // Orange
  Lost: "#f43f5e", // Rose
};

export const DashboardPage = () => {
  const { leads, isLoading, fetchLeads } = useLeads();
  const { stats, loading: statsLoading, refresh: refreshStats } = useStats();
  const { isAdmin } = usePermissions();
  const { user } = useAuth();

  useEffect(() => { fetchLeads({ page: 1, limit: 6, sort: "latest" }); }, [fetchLeads]);

  return (
    <PageWrapper>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            {isAdmin ? "Global Intelligence" : "My Pipeline"}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <Link
          to="/leads"
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: "var(--accent, #6366f1)" }}
        >
          All leads <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <LeadStats stats={stats} loading={statsLoading} />

      {/* Two-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent leads — wider */}
        <div
          className="lg:col-span-3 rounded-3xl border glass-heavy relative z-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Recent Leads</h2>
            <Link to="/leads" className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--accent)" }}
              />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No leads yet. <Link to="/leads" style={{ color: "var(--accent)" }}>Add one →</Link>
              </p>
            </div>
          ) : (
            <ul>
              {leads.slice(0, 6).map((lead, i) => (
                <li
                  key={lead.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]"
                  style={{ borderTop: i > 0 ? `1px solid var(--border)` : undefined }}
                >
                  {/* Initials avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                      {lead.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                    <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pipeline — narrower */}
        <div
          className="lg:col-span-2 rounded-3xl border p-6 glass-heavy relative z-10 flex flex-col"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-semibold mb-6" style={{ color: "var(--text)" }}>Pipeline</h2>

          <div className="space-y-5">
            {(stats ? ["New", "Contacted", "Qualified", "Lost"] : ["New", "Contacted", "Qualified", "Lost"]).map((label) => {
              const value = stats?.counts?.[label] ?? 0;
              const total = stats?.total ?? 0;
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              const color = staticPipelineColors[label] ?? "var(--accent)";
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: "var(--text)" }}>{value}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--surface-2)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total conversion rate */}
          <div
            className="mt-8 pt-5 border-t flex items-baseline justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Conversion rate</span>
            <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{stats && stats.total > 0 ? `${Math.round((stats.counts?.Qualified ?? 0) / stats.total * 100)}%` : "0%"}</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
