// src/services/authService.ts
import { authClient } from "./apiClient";

// ------------------------------------------------------
// Types de base pour Auth
// ------------------------------------------------------
export type RegisterDto = { name: string; email: string; password: string };
export type LoginDto = { email: string; password: string };

// ------------------------------------------------------
// Types pour l'administration
// ------------------------------------------------------
export interface UtilisateurDto {
  id: number;
  name: string | null;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface NotificationDto {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUpdateUserDto {
  name?: string | null;
  email?: string;
  is_active?: boolean;
  is_admin?: boolean;
  new_password?: string;
}

// ------------------------------------------------------
// Helpers JWT : décoder le token pour récupérer des infos
// ------------------------------------------------------
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Lit le token depuis localStorage, extrait name/email
 * et enregistre un “snapshot” local de l’utilisateur.
 */
export function saveUserSnapshotFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = parseJwt(token) || {};
  const name =
    payload.name ||
    payload.given_name ||
    payload.fullname ||
    payload.sub?.split("@")?.[0] ||
    "Utilisateur";
  const email = payload.email || "";

  localStorage.setItem("user_name", name);
  localStorage.setItem("user_email", email);
}

/** Retourne le snapshot (nom / email) stocké localement */
export function getUserSnapshot() {
  return {
    name: localStorage.getItem("user_name") || "",
    email: localStorage.getItem("user_email") || "",
  };
}

// =======================================================
//                 API AUTH (public)
// =======================================================

/** Inscription d’un nouvel utilisateur */
export async function registerUser(dto: RegisterDto) {
  return authClient.post<{ message: string; user?: any }>("/register", dto);
}

/** Connexion : renvoie le token et le stocke dans localStorage */
export async function loginUser(dto: LoginDto) {
  const data = await authClient.post<{
    token?: string;
    access_token?: string;
    user?: any;
  }>("/login", dto);

  const token = data.access_token ?? data.token;
  if (token) {
    localStorage.setItem("token", token);
    saveUserSnapshotFromToken();
  }

  return data;
}

/** Déconnexion : nettoie les infos locales */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
}

// =======================================================
//                 API ADMIN (protégée)
// =======================================================

/** Liste de tous les utilisateurs (réservé à l’admin) */
export async function adminListerUtilisateurs(): Promise<UtilisateurDto[]> {
  const data = await authClient.get<UtilisateurDto[]>("/admin/users");
  return data;
}

/** Modifier un utilisateur (nom, email, actif, admin, mot de passe) */
export async function adminModifierUtilisateur(
  userId: number,
  payload: AdminUpdateUserDto
): Promise<UtilisateurDto> {
  const data = await authClient.put<UtilisateurDto>(
    `/admin/users/${userId}`,
    payload
  );
  return data;
}

/** Envoyer une notification à un utilisateur */
export async function adminEnvoyerNotification(
  userId: number,
  titre: string,
  message: string
): Promise<NotificationDto> {
  const data = await authClient.post<NotificationDto>("/admin/notifications", {
    user_id: userId,
    title: titre,
    message,
  });
  return data;
}

/** Récupérer les notifications de l’utilisateur connecté */
export async function recupererMesNotifications(): Promise<NotificationDto[]> {
  const data = await authClient.get<NotificationDto[]>("/me/notifications");
  return data;
}
