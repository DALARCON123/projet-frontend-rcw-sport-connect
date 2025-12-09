import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { loginUser, saveUserSnapshotFromToken } from "../services/authService";
import { useTranslation } from "react-i18next";

/**
 * Décode un token JWT et renvoie true si l'utilisateur est administrateur.
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.email || !form.password) {
      setErr("Email et mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      const token =
        (res as any)?.access_token ??
        (res as any)?.token ??
        localStorage.getItem("token");

      if (!token) {
        throw new Error("Le jeton JWT n'a pas été reçu.");
      }

      // token
      localStorage.setItem("token", token);

      // 👇 IMPORTANTE: guardar e-mail (e opcionalmente nome) para o Reco.tsx
      localStorage.setItem("user_email", form.email.trim());

      // se o saveUserSnapshotFromToken já salva user_name, mantemos:
      saveUserSnapshotFromToken();

      const estAdminDepuisToken = isAdminFromToken(token);

      const emailLower = form.email.trim().toLowerCase();
      const estAdminParEmail = emailLower === "dianaalarcon@teccart.com";

      const estAdmin = estAdminDepuisToken || estAdminParEmail;

      if (estAdmin) {
        nav("/admin/users");
      } else {
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

        {err && (
          <div className="rounded-xl bg-red-50 border-2 border-red-200 px-4 py-3 flex items-start gap-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <p className="text-sm text-red-700 font-medium">{err}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {t("pages.login.cta") as string}
        </button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-600">
            {t("nav.register") as string}{" "}
            <Link to="/register" className="font-bold text-purple-600 hover:text-pink-600 transition-colors underline decoration-2 underline-offset-2">
              {t("pages.register.title") as string}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

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
    <label className="relative block group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
        {icon}
      </span>
      <input
        className="w-full rounded-xl border-2 border-slate-200 bg-white pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all text-slate-900 placeholder:text-slate-400"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
