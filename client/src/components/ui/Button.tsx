import React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base = [
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl",
      "transition-all duration-150 ease-out select-none cursor-pointer",
      "active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:opacity-40 disabled:pointer-events-none",
    ].join(" ");

    const sizes = {
      xs: "px-2.5 py-1.5 text-[11px] rounded-lg",
      sm: "px-3.5 py-2 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-sm",
    };

    const variants = {
      primary:   "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_4px_14px_rgba(20,184,166,0.4)] dark:shadow-[0_4px_14px_rgba(20,184,166,0.2)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.5)] transition-shadow duration-300",
      secondary: "glass text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
      danger:    "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.4)] dark:shadow-[0_4px_14px_rgba(239,68,68,0.2)]",
      outline:   "glass border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]",
      ghost:     "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
