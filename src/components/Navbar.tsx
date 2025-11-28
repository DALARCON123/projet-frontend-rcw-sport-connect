import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangSwitcher from "./LangSwitcher";
import { Sparkles, ShieldCheck } from "lucide-react";
import { isAdminFromToken } from "../services/authService";

const link =
  "px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/80 hover:shadow-sm";
const active = "bg-white/90 text-ink shadow-sm border border-slate-200";

export default function Navbar() {
  const { t } = useTranslation();
  const isAuth = !!localStorage.getItem("token");
  const isAdmin = isAdminFromToken();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("profile_v1");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-sm">
      {/* FR: Barre de navigation principale */}
      <nav className="w-full flex items-center justify-between px-6 py-3">
        {/* Logo / lien d’accueil */}
        <Link
          to={isAuth ? "/dashboard" : "/"}
          className="flex items-center gap-2 group"
        >
          <Sparkles className="text-fuchsia-600 group-hover:rotate-12 transition" />
          <span className="font-extrabold tracking-tight text-xl text-slate-800">
            SportConnectIA
          </span>
        </Link>

        {/* Menú */}
        <div className="flex items-center gap-2">
          {/* Liens publics (non authentifié) */}
          {!isAuth && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.home")}
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.login")}
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.register")}
              </NavLink>
            </>
          )}

          {/* Liens privés (authentifié) */}
          {isAuth && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.dashboard")}
              </NavLink>

              <NavLink
                to="/reco"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.reco")}
              </NavLink>

              <NavLink
                to="/sports"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.sports")}
              </NavLink>

              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `${link} ${isActive ? active : ""}`
                }
              >
                {t("nav.chat")}
              </NavLink>

              {/* Botão Admin - apenas para administradores */}
              {isAdmin && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `${link} ${
                      isActive ? active : ""
                    } flex items-center gap-1.5`
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t("nav.admin", "Admin")}
                </NavLink>
              )}
            </>
          )}

          {/* Sélecteur de langue */}
          <div className="ml-2">
            <LangSwitcher />
          </div>

          {/* Bouton de déconnexion */}
          {isAuth && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-300/60 bg-white/80 hover:bg-white transition shadow-sm"
            >
              {t("nav.logout", "Logout")}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
