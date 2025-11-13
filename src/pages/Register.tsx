// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, User, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { registerUser, loginUser, saveUserSnapshotFromToken } from "../services/authService";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.name || !form.email || !form.password) {
      setErr("Todos los campos son obligatorios.");
      return;
    }
    if (form.password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });

      // Auto-login
      const res = await loginUser({ email: form.email.trim(), password: form.password });
      const token = (res as any)?.token ?? (res as any)?.access_token;
      if (!token) throw new Error("No se recibió el token.");

      localStorage.setItem("token", token);
      saveUserSnapshotFromToken();

      // primera vez → onboarding
      nav("/onboarding");
    } catch (e: any) {
      setErr(String(e?.message || e?.detail || "No se pudo registrar."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("pages.register.title") as string}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<User className="h-5 w-5" />}
          type="text"
          placeholder="Nombre completo"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
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
        <Field
          icon={<Lock className="h-5 w-5" />}
          type="password"
          placeholder="Confirmar contraseña"
          value={form.confirm}
          onChange={(v) => setForm({ ...form, confirm: v })}
        />

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-sky-600 hover:opacity-95 transition shadow-lg disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("pages.register.cta") as string}
        </button>

        <p className="text-sm text-slate-600">
          {t("nav.login") as string}?{" "}
          <Link to="/login" className="underline">
            {t("pages.login.title") as string}
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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
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
