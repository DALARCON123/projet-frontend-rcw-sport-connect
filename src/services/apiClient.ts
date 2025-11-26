// src/services/apiClient.ts
const isDev = import.meta.env.DEV;

// En dev usamos prefijos que resuelve el proxy de Vite.
// En prod, URLs absolutas desde variables de entorno.
export const AUTH_BASE   = isDev ? '/auth'   : (import.meta.env.VITE_AUTH_URL   as string);
export const SPORTS_BASE = isDev ? '/sports' : (import.meta.env.VITE_SPORTS_URL as string);
export const RECO_BASE   = isDev ? '/reco'   : (import.meta.env.VITE_RECO_URL   as string);
export const CHAT_BASE   = isDev ? '/chat'   : (import.meta.env.VITE_CHAT_URL   as string);

// ------------------------------------------------------------------
// Utilidad para unir base + path sin duplicar /
//   joinUrl('/auth', '/login')    -> '/auth/login'
//   joinUrl('/auth/', 'login')    -> '/auth/login'
// ------------------------------------------------------------------
function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

// ------------------------------------------------------------------
// Request genérico que usan todos los clientes (auth, sports, reco, chat)
// ------------------------------------------------------------------
async function request<T>(base: string, path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {}),
  };

  const res = await fetch(joinUrl(base, path), {
    ...init,
    headers,
    method: init.method ?? 'GET',   // GET por defecto si no se indica
  });

  if (!res.ok) {
    // Intenta parsear JSON; si no, texto plano.
    try {
      const errJson = await res.json();
      throw errJson;
    } catch {
      throw await res.text();
    }
  }

  // 204 No Content
  if (res.status === 204) return {} as T;

  return (await res.json()) as T;
}

// ------------------------------------------------------------------
// Fábrica de clientes por servicio
// ------------------------------------------------------------------
export function createClient(base: string) {
  return {
    get:   <T>(path: string)         => request<T>(base, path, { method: 'GET' }),
    post:  <T>(path: string, body?: any) =>
      request<T>(base, path, { method: 'POST',  body: JSON.stringify(body) }),
    put:   <T>(path: string, body?: any) =>
      request<T>(base, path, { method: 'PUT',   body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: any) =>
      request<T>(base, path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete:<T>(path: string)         =>
      request<T>(base, path, { method: 'DELETE' }),
  };
}

// Clientes concretos
export const authClient   = createClient(AUTH_BASE);
export const sportsClient = createClient(SPORTS_BASE);
export const recoClient   = createClient(RECO_BASE);
export const chatClient   = createClient(CHAT_BASE);
