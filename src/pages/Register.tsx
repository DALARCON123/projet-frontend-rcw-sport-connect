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
      setErr(t("pages.register.errors.required", "Todos los campos son obligatorios."));
      return;
    }
    if (form.password.length < 6) {
      setErr(
        t(
          "pages.register.errors.min_length",
          "La contraseña debe tener al menos 6 caracteres."
        )
      );
      return;
    }
    if (form.password !== form.confirm) {
      setErr(
        t(
          "pages.register.errors.mismatch",
          "Las contraseñas no coinciden."
        )
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });

      // Auto-login
      const res = await loginUser({ email: form.email.trim(), password: form.password });
      const token = (res as any)?.token ?? (res as any)?.access_token;
      if (!token) throw new Error(t("pages.register.errors.no_token", "No se recibió el token."));

      localStorage.setItem("token", token);

      // 👇 IMPORTANTE: salvar e-mail e nome para o Reco.tsx e saudação do e-mail
      localStorage.setItem("user_email", form.email.trim());
      localStorage.setItem("user_name", form.name.trim());

      saveUserSnapshotFromToken();

      nav("/onboarding");
    } catch (e: any) {
      setErr(
        String(
          e?.message ||
          e?.detail ||
          t("pages.register.errors.generic", "No se pudo registrar.")
        )
      );
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
          placeholder={t("pages.register.fields.name", "Nombre completo") as string}
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          icon={<AtSign className="h-5 w-5" />}
          type="email"
          placeholder={t("pages.register.fields.email", "Email") as string}
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          icon={<Lock className="h-5 w-5" />}
          type="password"
          placeholder={t("pages.register.fields.password", "Contraseña") as string}
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <Field
          icon={<Lock className="h-5 w-5" />}
          type="password"
          placeholder={t("pages.register.fields.confirm", "Confirmar contraseña") as string}
          value={form.confirm}
          onChange={(v) => setForm({ ...form, confirm: v })}
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
          {t("pages.register.cta") as string}
        </button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-600">
            {t("pages.register.have_account", "¿Ya tienes cuenta?") as string}{" "}
            <Link to="/login" className="font-bold text-purple-600 hover:text-pink-600 transition-colors underline decoration-2 underline-offset-2">
              {t("pages.login.title") as string}
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
