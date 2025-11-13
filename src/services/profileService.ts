import { recoClient } from './apiClient'

export type ProfileDto = {
  age: number
  height_cm: number
  weight_kg: number
  gender: 'female' | 'male' | 'other'
  activity: 'low' | 'medium' | 'high'
  goal: string
}

const KEY = 'profile_v1'

export function getProfileLocal(): ProfileDto | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ProfileDto) : null
  } catch {
    return null
  }
}

export function saveProfileLocal(p: ProfileDto) {
  localStorage.setItem(KEY, JSON.stringify(p))
}

/** Envía/actualiza el perfil en el microservicio de recomendaciones (ajusta ruta real si difiere). */
export async function upsertProfile(p: ProfileDto) {
  // cambia '/profile' por la ruta que tengas (p.ej. '/reco/profile')
  try {
    await recoClient.post('/profile', p)
  } catch (e) {
    // si tu backend aún no está listo, puedes ignorarlo y trabajar offline
    // throw e
  }
}

/** Extrae nombre del JWT para saludo en navbar, si existe */
export function userNameFromToken(): string | undefined {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const name = payload?.name || payload?.email
    if (name) localStorage.setItem('user_name', name)
    return name
  } catch {
    return
  }
}
