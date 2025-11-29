import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { loginUser, saveUserSnapshotFromToken } from "../services/authService";
import { useTranslation } from "react-i18next";

/**
 * Décode un token JWT et renvoie true si l'utilisateur est administrateur.
 * On vérifie les champs is_admin ou role === "admin" dans la charge utile.
 */
function isAdminFromToken(token: string | null): boolean {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    if (payload.is_admin === true) return true;
    if (payload.role && String(payload.role).toLowerCase() === "admin") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /**
   * Soumission du formulaire de connexion.
   */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.email || !form.password) {
      setErr("Email et mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoading(true);

      // Appel au microservice d'authentification
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Récupération du token (retourné par l'API ou déjà stocké par loginUser)
      const token =
        (res as any)?.access_token ??
        (res as any)?.token ??
        localStorage.getItem("token");

      if (!token) {
        throw new Error("Le jeton JWT n'a pas été reçu.");
      }

      // Sauvegarde du token au cas où loginUser ne l'aurait pas déjà fait
      localStorage.setItem("token", token);

      // Sauvegarde du nom et de l'email pour le navbar
      saveUserSnapshotFromToken();

      // Détection admin à partir du token
      const estAdminDepuisToken = isAdminFromToken(token);

      // Fallback simple : email spécifique de l'admin
      const emailLower = form.email.trim().toLowerCase();
      const estAdminParEmail = emailLower === "dianaalarcon@teccart.com";

      const estAdmin = estAdminDepuisToken || estAdminParEmail;

      if (estAdmin) {
        // Redirection vers l'espace administrateur
        nav("/admin/users");
      } else {
        // Logique classique pour les utilisateurs normaux
        const hasProfile = !!localStorage.getItem("profile_v1");
        nav(hasProfile ? "/dashboard" : "/onboarding");
      }
    } catch (e: any) {
      setErr(
        String(
          e?.message ||
            e?.detail ||
            "Erreur de connexion. Vérifiez vos identifiants."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("pages.login.title") as string}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<AtSign className="h-5 w-5" />}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          icon={<Lock className="h-5 w-5" />}
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-lg disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("pages.login.cta") as string}
        </button>

        <p className="text-sm text-slate-600">
          {t("nav.register") as string}{" "}
          <Link to="/register" className="underline">
            {t("pages.register.title") as string}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

/**
 * Champ de formulaire avec icône à gauche.
 */
function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>
      <input
        className="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-sky-400"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
