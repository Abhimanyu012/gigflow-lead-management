import React from "react";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "Get started by creating a new entry.",
  action,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-3xl border border-dashed glass-heavy relative z-10"
      style={{
        borderColor: "var(--border)",
      }}
    >
      {/* Icon container */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-teal-500/10 shadow-sm"
      >
        <FolderSearch className="w-7 h-7" style={{ color: "var(--accent)" }} />
      </div>

      {/* Heading */}
      <h3 className="text-base font-bold mb-1.5" style={{ color: "var(--text)" }}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>

      {/* Optional CTA */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
