// src/services/profileService.ts

export type Profile = {
  age?: number;          // edad
  weightKg?: number;     // peso en kg
  heightCm?: number;     // talla en cm
  goal?: string;         // objetivo principal (p.ej. "Perte de poids")
  daysPerWeek?: number;  // cuántos días a la semana quiere entrenar
  minutesPerSession?: number; // minutos por sesión
  level?: "debutant" | "intermediaire" | "avance";
};

const STORAGE_KEY = "profile_v1";

export function getProfileLocal(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

/**
 * Guarda (o actualiza) el perfil en localStorage.
 * Puedes pasar solo algunos campos: hace merge con lo que ya había.
 */
export function saveProfileLocal(partial: Partial<Profile>): Profile {
  const current = getProfileLocal() || {};
  const merged: Profile = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export function clearProfileLocal() {
  localStorage.removeItem(STORAGE_KEY);
}
