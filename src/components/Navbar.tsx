import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LangSwitcher from "./LangSwitcher";
import { Sparkles } from "lucide-react";

const link =
  "px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/80 hover:shadow-sm";
const active =
  "bg-white/90 text-ink shadow-sm border border-slate-200";

export default function Navbar() {
  const { t } = useTranslation();
  const isAuth = !!localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("profile_v1");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-sm">
      {/* AHORA EL NAV OCUPA TODO EL ANCHO */}
      <nav className="w-full flex items-center justify-between px-6 py-3">
        {/* LOGO */}
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
          {/* Public links (NO autenticado) */}
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

          {/* Private links (AUTENTICADO) */}
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
            </>
          )}

          {/* Idioma */}
          <div className="ml-2">
            <LangSwitcher />
          </div>

          {/* Logout */}
          {isAuth && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-300/60 bg-white/80 hover:bg-white transition shadow-sm"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
