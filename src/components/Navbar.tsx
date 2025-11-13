import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import { Sparkles } from 'lucide-react'

const link = 'px-3 py-2 rounded-xl hover:bg-white/70 transition'
const active = 'bg-white/80 text-ink'

export default function Navbar() {
  const { t } = useTranslation()
  const isAuth = !!localStorage.getItem('token')
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('profile_v1')
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/60">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to={isAuth ? '/dashboard' : '/'} className="flex items-center gap-2">
          <Sparkles className="text-accent" />
          <span className="font-extrabold tracking-tight text-xl">SportConnectIA</span>
        </Link>

        {/* Menú */}
        <div className="flex items-center gap-1">
          {/* Home solo si NO está autenticado */}
          {!isAuth && (
            <NavLink to="/" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
              {t('nav.home')}
            </NavLink>
          )}

          {/* Zonas protegidas */}
          {isAuth && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.dashboard')}
              </NavLink>
              <NavLink to="/reco" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.reco')}
              </NavLink>
              <NavLink to="/sports" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.sports')}
              </NavLink>
              <NavLink to="/chat" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.chat')}
              </NavLink>
            </>
          )}

          {/* Auth links cuando NO hay sesión */}
          {!isAuth && (
            <>
              <NavLink to="/login" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.login')}
              </NavLink>
              <NavLink to="/register" className={({isActive}) => `${link} ${isActive ? active : ''}`}>
                {t('nav.register')}
              </NavLink>
            </>
          )}

          {/* Idioma SIEMPRE al final */}
          <div className="ml-2"><LangSwitcher /></div>

          {/* Logout (sin “welcome” en el navbar) */}
          {isAuth && (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 rounded-xl border border-slate-300/70 bg-white/70 hover:bg-white transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
