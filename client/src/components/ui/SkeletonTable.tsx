import React from "react";

export const SkeletonTable = () => {
  return (
    <div
      className="overflow-hidden rounded-3xl border animate-pulse glass-heavy shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative z-10"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 border-b flex gap-8 bg-[var(--surface-2)]/30 backdrop-blur-md"
        style={{ borderColor: "var(--border)" }}
      >
        {[40, 20, 20, 20, 15].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-md"
            style={{ width: `${w}%`, background: "var(--border)" }}
          />
        ))}
      </div>

      {/* Rows */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="px-5 py-4 flex gap-8 items-center border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-2 flex-[2]">
            <div className="h-3 w-1/2 rounded-md" style={{ background: "var(--border)" }} />
            <div className="h-2.5 w-3/4 rounded-md" style={{ background: "var(--surface-2)" }} />
          </div>
          <div className="h-5 w-16 rounded-full" style={{ background: "var(--border)" }} />
          <div className="h-3 flex-1 rounded-md" style={{ background: "var(--border)" }} />
          <div className="h-3 flex-1 rounded-md" style={{ background: "var(--surface-2)" }} />
          <div className="flex gap-2 justify-end">
            <div className="h-7 w-8 rounded-lg" style={{ background: "var(--border)" }} />
            <div className="h-7 w-8 rounded-lg" style={{ background: "var(--border)" }} />
          </div>
        </div>
      ))}
    </div>
  );
};
