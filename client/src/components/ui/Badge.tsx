import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "new" | "contacted" | "qualified" | "lost" | "default";
}

const styles: Record<string, string> = {
  new:       "bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/20 shadow-sm",
  contacted: "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 shadow-sm",
  qualified: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/20 shadow-sm",
  lost:      "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20 shadow-sm",
  default:   "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] shadow-sm",
};

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", children, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide",
      styles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
