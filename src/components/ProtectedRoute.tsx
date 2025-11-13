import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getProfileLocal } from '../services/profileService'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = !!localStorage.getItem('token')
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Si el usuario entra a algo distinto de onboarding/dashboard y no tiene perfil, lo mandamos a onboarding
  const profile = getProfileLocal()
  const path = location.pathname.toLowerCase()
  if (!profile && path !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
