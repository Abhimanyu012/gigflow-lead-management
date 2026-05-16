import React from "react";
import { Lead } from "../../types/lead.types";
import { Badge } from "../../components/ui/Badge";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/ui/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { SkeletonTable } from "../../components/ui/SkeletonTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Edit2, Trash2, Eye } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

const statusVariant = (s: string): "new" | "contacted" | "qualified" | "lost" | "default" => {
  const m: Record<string, "new" | "contacted" | "qualified" | "lost"> = {
    New: "new", Contacted: "contacted", Qualified: "qualified", Lost: "lost",
  };
  return m[s] ?? "default";
};

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete, onView }) => {
  const { canDeleteLead } = usePermissions();

  if (isLoading) return <SkeletonTable />;
  if (!leads.length) return (
    <EmptyState
      title="No leads found"
      description="Try adjusting your filters, or add a new lead to get started."
    />
  );

  return (
    <div
      className="rounded-3xl border overflow-hidden glass-heavy shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative z-10"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]/30 backdrop-blur-md">
              {[
                { label: "Name", align: "left" },
                { label: "Status", align: "left" },
                { label: "Rep", align: "left" },
                { label: "Source", align: "left" },
                { label: "Added", align: "left" },
                { label: "", align: "right" },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-${align}`}
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr
                key={lead.id}
                className="group transition-colors hover:bg-teal-500/5 dark:hover:bg-teal-500/10 cursor-pointer"
                style={{ borderTop: i > 0 ? `1px solid var(--border)` : undefined }}
                onClick={() => onView(lead)}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {/* Initials dot */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm"
                      style={{
                        background: i % 2 === 0 ? "var(--accent-muted)" : "var(--accent-orange-muted)",
                        color: i % 2 === 0 ? "var(--accent)" : "var(--accent-orange)",
                      }}
                    >
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold leading-tight" style={{ color: "var(--text)" }}>{lead.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{lead.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-[10px] font-bold text-teal-600 dark:text-teal-400">
                      {lead.createdBy?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-sm font-medium text-[var(--text-muted)]">{lead.createdBy?.name || "System"}</span>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  {lead.source}
                </td>

                <td className="px-5 py-4 text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                  {formatDate(lead.createdAt)}
                </td>

                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="xs" onClick={() => onView(lead)} aria-label="View">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => onEdit(lead)} aria-label="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    {canDeleteLead && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onDelete(lead.id)}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
