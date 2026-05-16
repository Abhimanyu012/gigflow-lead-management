import { useLeadsStore } from "../store/leadsStore";
import { leadsApi } from "../api/leads.api";
import { Lead } from "../types/lead.types";
import { useState, useCallback } from "react";
import { Pagination } from "../types/pagination.types";
import { useToastStore } from "../store/toastStore";

interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

export const useLeads = () => {
  const setLeads = useLeadsStore((s) => s.setLeads);
  const setLoading = useLeadsStore((s) => s.setLoading);
  const leads = useLeadsStore((s) => s.leads);
  const isLoading = useLeadsStore((s) => s.isLoading);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Stable reference — setLeads and setLoading from Zustand are guaranteed stable
  const fetchLeads = useCallback(async (params: FetchParams) => {
    setLoading(true);
    try {
      const response = await leadsApi.getAll(params);
      setLeads(response.leads);
      setPagination(response.pagination);
    } catch {
      useToastStore.getState().addToast("Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  }, [setLeads, setLoading]);

  const createLead = async (leadData: Partial<Lead>) => {
    try {
      await leadsApi.create(leadData);
      useToastStore.getState().addToast("Lead created successfully", "success");
    } catch {
      useToastStore.getState().addToast("Failed to create lead", "error");
      throw new Error("Create failed");
    }
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      await leadsApi.update(id, leadData);
      useToastStore.getState().addToast("Lead updated successfully", "success");
    } catch {
      useToastStore.getState().addToast("Failed to update lead", "error");
      throw new Error("Update failed");
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadsApi.delete(id);
      useToastStore.getState().addToast("Lead deleted", "success");
    } catch {
      useToastStore.getState().addToast("Failed to delete lead", "error");
      throw new Error("Delete failed");
    }
  };

  return { leads, isLoading, fetchLeads, createLead, updateLead, deleteLead, pagination };
};
