import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getProfileLocal } from "../services/profileService";

export default function ProtectedRoute() {
  const isAuth = !!localStorage.getItem("token");
  const location = useLocation();

  // 1. Si NO está autenticado → login
  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Si está autenticado pero NO tiene perfil → onboarding obligatorio,
  //    excepto cuando ya está en /onboarding
  const profile = getProfileLocal();
  const path = location.pathname.toLowerCase();

  if (!profile && path !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // 3. Si pasa todos los chequeos → renderiza la ruta interna
  return <Outlet />;
}
