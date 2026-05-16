import React from "react";
import { Lead } from "../../types/lead.types";
import { Badge } from "../../components/ui/Badge";

export const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  return (
    <div className="p-4 rounded-3xl shadow-sm glass-heavy border border-[var(--border)] group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors pointer-events-none" />
      <div className="relative z-10">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{lead.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
        </div>
        <Badge>{lead.status}</Badge>
      </div>
      <div className="text-sm">
        <p><span className="font-semibold text-[var(--text)]">Source:</span> <span className="text-[var(--text-muted)]">{lead.source}</span></p>
      </div>
      </div>
    </div>
  );
};
