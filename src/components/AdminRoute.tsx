import { Navigate, Outlet } from "react-router-dom";
import { isAdminFromToken } from "../services/authService";

/**
 * AdminRoute - Protects routes that should only be accessible by administrators
 * Checks if the current user has admin privileges from their JWT token
 * If not admin, redirects to dashboard
 */
export default function AdminRoute() {
  const isAdmin = isAdminFromToken();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
