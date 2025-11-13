import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitcher from './LangSwitcher'
import { Sparkles } from 'lucide-react'

const link = 'px-3 py-2 rounded-xl hover:bg-white/70 transition'
const active = 'bg-white/80 text-ink'

export default function Navbar() {
  const { t } = useTranslation()
  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/60">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-accent" />
          <span className="font-extrabold tracking-tight text-xl">SportConnectIA</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.home')}</NavLink>
          <NavLink to="/sports" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.sports')}</NavLink>
          <NavLink to="/reco" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.reco')}</NavLink>
          <NavLink to="/chat" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.chat')}</NavLink>
          <NavLink to="/login" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.login')}</NavLink>
          <NavLink to="/register" className={({isActive})=>`${link} ${isActive?active:''}`}>{t('nav.register')}</NavLink>
          <div className="ml-2"><LangSwitcher /></div>
        </div>
      </nav>
    </header>
  )
}
