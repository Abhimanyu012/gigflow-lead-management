import React from "react";
import { PageWrapper } from "../components/layout/PageWrapper";
import { LeadTable } from "../features/leads/LeadTable";
import { LeadFilters } from "../features/leads/LeadFilters";
import { Button } from "../components/ui/Button";
import { LeadModal } from "../features/leads/LeadModal";
import { useLeads } from "../hooks/useLeads";
import { usePermissions } from "../hooks/usePermissions";
import { useDebounce } from "../hooks/useDebounce";
import { Lead } from "../types/lead.types";
import { Pagination } from "../components/ui/Pagination";
import { exportCSV } from "../utils/exportCSV";
import { useState, useEffect, useCallback } from "react";
import { Download, Plus } from "lucide-react";
import ConfirmModal from "../components/ui/ConfirmModal";

export const LeadsPage = () => {
  const { leads, isLoading, fetchLeads, createLead, updateLead, deleteLead, pagination } = useLeads();
  const { isAdmin } = usePermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadLeads = useCallback(() => {
    fetchLeads({ page, limit: 10, search: debouncedSearch, status, source, sort });
  }, [fetchLeads, page, debouncedSearch, status, source, sort]);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const handleSave = async (data: Partial<Lead>) => {
    if (editingLead) await updateLead(editingLead.id, data);
    else await createLead(data);
    loadLeads();
  };

  return (
    <PageWrapper>
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Leads</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {pagination ? `${pagination.total ?? leads.length} total` : `${leads.length} loaded`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const blob = await (await import("../api/leads.api")).leadsApi.exportAll({ status, source, search: debouncedSearch, sort });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `leads_export_${Date.now()}.csv`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                } catch (err) {
                  // toast will be shown by axios interceptor
                }
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
          <Button size="md" onClick={() => { setEditingLead(null); setIsViewOnly(false); setIsModalOpen(true); }} className="shadow-[0_4px_14px_rgba(20,184,166,0.3)]">
            <Plus className="w-4 h-4" />
            Add lead
          </Button>
        </div>
      </div>

      <LeadFilters
        searchTerm={searchTerm} onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        status={status} onStatusChange={(v) => { setStatus(v); setPage(1); }}
        source={source} onSourceChange={(v) => { setSource(v); setPage(1); }}
        sort={sort} onSortChange={(v) => { setSort(v); setPage(1); }}
      />

      <LeadTable
        leads={leads}
        isLoading={isLoading}
        onView={(lead) => { setEditingLead(lead); setIsViewOnly(true); setIsModalOpen(true); }}
        onEdit={(lead) => { setEditingLead(lead); setIsViewOnly(false); setIsModalOpen(true); }}
        onDelete={(id) => { setPendingDeleteId(id); setConfirmDeleteOpen(true); }}
      />

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Delete lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => { 
          if (pendingDeleteId) {
            try {
              await deleteLead(pendingDeleteId); 
            } catch (err) {
              // error toast is handled inside deleteLead
            }
          }
          setConfirmDeleteOpen(false); 
          setPendingDeleteId(null); 
          loadLeads(); 
        }}
        onCancel={() => { setConfirmDeleteOpen(false); setPendingDeleteId(null); }}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-3">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={editingLead}
        onSave={handleSave}
        isViewOnly={isViewOnly}
      />
    </PageWrapper>
  );
};
