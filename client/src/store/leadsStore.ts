import { create } from "zustand";
import { Lead } from "../types/lead.types";

interface LeadsStore {
  leads: Lead[];
  isLoading: boolean;
  setLeads: (leads: Lead[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useLeadsStore = create<LeadsStore>((set) => ({
  leads: [],
  isLoading: false,
  setLeads: (leads) => set({ leads }),
  setLoading: (isLoading) => set({ isLoading }),
}));
