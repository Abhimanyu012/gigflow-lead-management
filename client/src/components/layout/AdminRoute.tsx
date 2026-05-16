import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;
