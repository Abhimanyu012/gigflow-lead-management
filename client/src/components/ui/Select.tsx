import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select…",
  className,
  error,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-muted)" }}>
          {label}
        </label>
      )}

      {/* Trigger + dropdown anchored here */}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-5 py-3.5",
            "rounded-[1.25rem] text-base font-semibold border outline-none",
            "transition-all duration-200",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            open
              ? "border-[var(--accent)] ring-4 ring-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
              : !disabled && "hover:border-[var(--accent)]/50",
            error && "border-red-500 ring-4 ring-red-500/10"
          )}
          style={{
            background: "var(--surface-2)",
            color: selected ? "var(--text)" : "var(--text-muted)",
            borderColor: open ? undefined : "var(--border)",
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate text-left">{selected?.label ?? placeholder}</span>
          <ChevronDown
            className={cn("w-5 h-5 shrink-0 transition-transform duration-300 opacity-60", open && "rotate-180 opacity-100")}
            style={{ color: open ? "var(--accent)" : "var(--text-muted)" }}
          />
        </button>

        {/* Floating dropdown panel */}
        {open && (
          <div
            className="absolute left-0 right-0 z-[100] mt-2 rounded-[1.25rem] border shadow-2xl overflow-hidden backdrop-blur-xl"
            style={{
              top: "100%",
              background: "rgba(23, 23, 23, 0.85)", // Specific dark translucent
              borderColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
              animation: "dropdownIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
            role="listbox"
          >
            <div className="p-2 space-y-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium",
                      "transition-all duration-150 text-left",
                      isSelected
                        ? "bg-teal-500/20 text-teal-400 shadow-sm"
                        : "hover:bg-white/5 text-[var(--text)]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-teal-400" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide mt-1 ml-1">{error}</p>}
    </div>
  );
};
