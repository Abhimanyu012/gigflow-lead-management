import React from "react";
import { Users, TrendingUp, Star, XCircle } from "lucide-react";
import { Stats } from "../../hooks/useStats";

interface LeadStatsProps {
  stats: Stats | null;
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  blobColor: string;
  delta: string;
  deltaPositive: boolean;
  subtext: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  blobColor,
  delta,
  deltaPositive,
  subtext,
  loading,
}) => (
  <div
    className="relative p-5 rounded-3xl border glass overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-default"
    style={{ borderColor: "var(--border)" }}
  >
    {/* Background glow blob */}
    <div
      className={`absolute -bottom-6 -right-6 w-28 h-28 ${blobColor} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}
    />

    <div className="relative z-10 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-9 w-20 rounded-xl bg-[var(--surface-2)] animate-pulse" />
      ) : (
        <p
          className="text-3xl font-black tracking-tight tabular-nums"
          style={{ color: "var(--text)" }}
        >
          {value}
        </p>
      )}

      {/* Delta badge + subtext */}
      <div className="flex items-center gap-2 mt-1">
        {loading ? (
          <div className="h-5 w-28 rounded-full bg-[var(--surface-2)] animate-pulse" />
        ) : (
          <>
            <span
              className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${
                deltaPositive
                  ? "bg-teal-500/15 text-teal-500"
                  : "bg-rose-500/15 text-rose-500"
              }`}
            >
              {delta}
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {subtext}
            </span>
          </>
        )}
      </div>
    </div>
  </div>
);

export const LeadStats: React.FC<LeadStatsProps> = ({ stats, loading }) => {
  const total = stats?.total ?? 0;
  const newLeads = stats?.counts?.New ?? 0;
  const qualified = stats?.counts?.Qualified ?? 0;
  const lost = stats?.counts?.Lost ?? 0;
  const newThisMonth = stats?.newThisMonth ?? 0;
  const newThisWeek = stats?.newThisWeek ?? 0;
  const vsLastMonth = stats?.vsLastMonth ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;

  const vsLastMonthLabel =
    vsLastMonth > 0
      ? `+${vsLastMonth} vs last month`
      : vsLastMonth < 0
      ? `${vsLastMonth} vs last month`
      : "Same as last month";

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Leads"
        value={total}
        icon={Users}
        iconColor="bg-teal-500/15 text-teal-500"
        blobColor="bg-teal-500/10"
        delta={newThisMonth > 0 ? `+${newThisMonth} this month` : `${newThisMonth} this month`}
        deltaPositive={newThisMonth >= 0}
        subtext={vsLastMonthLabel}
        loading={loading}
      />
      <StatCard
        label="New Leads"
        value={newLeads}
        icon={TrendingUp}
        iconColor="bg-sky-500/15 text-sky-500"
        blobColor="bg-sky-500/10"
        delta={newThisWeek > 0 ? `+${newThisWeek} this week` : `${newThisWeek} this week`}
        deltaPositive={newThisWeek >= 0}
        subtext="added recently"
        loading={loading}
      />
      <StatCard
        label="Qualified"
        value={qualified}
        icon={Star}
        iconColor="bg-orange-500/15 text-orange-500"
        blobColor="bg-orange-500/10"
        delta={`${conversionRate}% rate`}
        deltaPositive={conversionRate >= 25}
        subtext="conversion rate"
        loading={loading}
      />
      <StatCard
        label="Lost"
        value={lost}
        icon={XCircle}
        iconColor="bg-rose-500/15 text-rose-500"
        blobColor="bg-rose-500/10"
        delta={
          vsLastMonth > 0
            ? `+${vsLastMonth} vs last month`
            : vsLastMonth < 0
            ? `${vsLastMonth} vs last month`
            : "No change"
        }
        deltaPositive={vsLastMonth <= 0}
        subtext="leads not converted"
        loading={loading}
      />
    </div>
  );
};
