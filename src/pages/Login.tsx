import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { loginUser, saveUserSnapshotFromToken } from "../services/authService";
import { useTranslation } from "react-i18next";

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
      setErr("Email y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);

      // 1) Login contra el microservicio Auth
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      // acepta { token } ó { access_token }
      const token = (res as any)?.token ?? (res as any)?.access_token;
      if (!token) throw new Error("No se recibió el token.");

      // guardar token en localStorage
      localStorage.setItem("token", token);

      // guardar snapshot del nombre para el saludo en el navbar
      saveUserSnapshotFromToken();

      // 2) Determinar si es admin según el email que escribió
      const emailLower = form.email.trim().toLowerCase();
      const isAdmin = emailLower === "dianaalarcon@teccart.com";

      if (isAdmin) {
        // 👉 si es admin, lo enviamos al panel de administración
        nav("/admin/users");
      } else {
        // 👉 si NO es admin, usamos tu lógica anterior
        const hasProfile = !!localStorage.getItem("profile_v1");
        nav(hasProfile ? "/dashboard" : "/onboarding");
      }
    } catch (e: any) {
      setErr(String(e?.message || e?.detail || "Credenciales inválidas."));
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
          placeholder="Contraseña"
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
          {t("nav.register") as string}?{" "}
          <Link to="/register" className="underline">
            {t("pages.register.title") as string}
          </Link>
        </p>
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
