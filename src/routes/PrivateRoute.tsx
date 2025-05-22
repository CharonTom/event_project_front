import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/connection-gate" replace />;
  }
  return <Outlet />;
};
