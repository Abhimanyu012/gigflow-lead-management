import { useAuth } from "../context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isSales = user?.role === "sales";

  const canEditLead = isAdmin || isSales;
  const canDeleteLead = isAdmin || isSales;

  return { isAdmin, isSales, canEditLead, canDeleteLead };
};
