// src/services/authService.ts
import { authClient } from "./apiClient";

export type RegisterDto = { name: string; email: string; password: string };
export type LoginDto = { email: string; password: string };

// ---- Helpers JWT ----
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

/** Lee el token de localStorage, extrae nombre/email y guarda un snapshot local */
export function saveUserSnapshotFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = parseJwt(token) || {};
  const name =
    payload.name ||
    payload.given_name ||
    payload.fullname ||
    payload.sub?.split("@")?.[0] ||
    "User";
  const email = payload.email || "";

  localStorage.setItem("user_name", name);
  localStorage.setItem("user_email", email);
}

export function getUserSnapshot() {
  return {
    name: localStorage.getItem("user_name") || "",
    email: localStorage.getItem("user_email") || "",
  };
}

/** Devuelve el payload completo del JWT guardado (o null si no hay) */
export function getAuthPayload(): any | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return parseJwt(token) || null;
}

/** Devuelve true si el token actual corresponde a un admin */
export function isAdminFromToken(): boolean {
  const payload = getAuthPayload();
  if (!payload) return false;

  // 1) Si el backend ya envía un flag is_admin en el token
  if (typeof payload.is_admin === "boolean") {
    return payload.is_admin;
  }

  // 2) Fallback: comprobar por email del admin del proyecto
  const email =
    (payload.email || payload.sub || "").toString().trim().toLowerCase();
  return email === "dianaalarcon@teccart.com";
}

// ---- API ----

// En dev: AUTH_BASE = '/auth'  ->  '/auth/register'
export async function registerUser(dto: RegisterDto) {
  return authClient.post<{ message: string; user?: any }>("/register", dto);
}

// En dev: AUTH_BASE = '/auth'  ->  '/auth/login'
export async function loginUser(dto: LoginDto) {
  const data = await authClient.post<{
    token?: string;
    access_token?: string;
    user?: any;
  }>("/login", dto);

  // Guarda el token (si viene) para las siguientes peticiones
  const token = data.access_token ?? data.token;
  if (token) {
    localStorage.setItem("token", token);
    // opcional: rellenar snapshot local
    saveUserSnapshotFromToken();
  }

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
}
