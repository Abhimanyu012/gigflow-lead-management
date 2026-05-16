import { api } from "./axios";
import { Lead } from "../types/lead.types";
import { Pagination } from "../types/pagination.types";

interface RawLead {
  _id: string;
  id?: string;
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdAt: string;
  updatedAt: string;
  createdBy?: { _id: string; id?: string; name: string; email: string };
}

interface LeadsResponse {
  data: {
    leads: RawLead[];
    pagination: Pagination;
  };
}

interface FetchLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

export const leadsApi = {
  getAll: async (params: FetchLeadsParams) => {
    const { data } = await api.get<LeadsResponse>("/leads", { params });
    const payload = data.data;
    const leads = (payload.leads || []).map((l: RawLead) => ({
      id: l.id ?? l._id,
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : "",
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : "",
      createdBy: l.createdBy ? { id: l.createdBy.id ?? l.createdBy._id, name: l.createdBy.name, email: l.createdBy.email } : { id: "", name: "", email: "" },
    }));
    return { ...payload, leads };
  },
  getStats: async () => {
    const { data } = await api.get<{ 
      data: { 
        total: number; 
        counts: Record<string, number>;
        newThisMonth: number;
        newThisWeek: number;
        vsLastMonth: number;
        conversionRate: number;
      } 
    }>("/leads/stats");
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<{ data: RawLead }>(`/leads/${id}`);
    const l = data.data;
    return {
      id: l.id ?? l._id,
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : "",
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : "",
      createdBy: l.createdBy ? { id: l.createdBy.id ?? l.createdBy._id, name: l.createdBy.name, email: l.createdBy.email } : { id: "", name: "", email: "" },
    } as Lead;
  },
  create: async (leadData: Partial<Lead>) => {
    const { data } = await api.post<{ data: RawLead }>("/leads", leadData);
    const l = data.data;
    return {
      id: l.id ?? l._id,
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : "",
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : "",
      createdBy: l.createdBy ? { id: l.createdBy.id ?? l.createdBy._id, name: l.createdBy.name, email: l.createdBy.email } : { id: "", name: "", email: "" },
    } as Lead;
  },
  update: async (id: string, leadData: Partial<Lead>) => {
    const { data } = await api.put<{ data: RawLead }>(`/leads/${id}`, leadData);
    const l = data.data;
    return {
      id: l.id ?? l._id,
      name: l.name,
      email: l.email,
      status: l.status,
      source: l.source,
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : "",
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : "",
      createdBy: l.createdBy ? { id: l.createdBy.id ?? l.createdBy._id, name: l.createdBy.name, email: l.createdBy.email } : { id: "", name: "", email: "" },
    } as Lead;
  },
  delete: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },
  exportAll: async (params?: FetchLeadsParams) => {
    const response = await api.get(`/leads/export`, { params, responseType: "blob" });
    return response.data as Blob;
  },
};
