// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProfileLocal } from "../services/profileService";
import { User2, Activity, Ruler, Target, Brain } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
};

const StatCard = ({ label, value, subtitle, icon }: StatCardProps) => (
  <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-4 flex flex-col justify-between">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
        <p className="mt-2 text-xl md:text-2xl font-bold text-slate-900">
          {value}
        </p>
      </div>
      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
        {icon}
      </div>
    </div>
    {subtitle && <p className="mt-2 text-[11px] text-slate-500">{subtitle}</p>}
  </div>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const profile = getProfileLocal();
  const name = (localStorage.getItem("user_name") || "").trim();

  // Valores básicos (solo usamos las props de Profile)
  const age = profile?.age;
  const weight = profile?.weightKg;
  const height = profile?.heightCm;
  const goal = profile?.goal;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* TÍTULO + BIENVENIDA */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {t("pages.dashboard.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {name
            ? t("pages.dashboard.welcome", { name })
            : t("pages.dashboard.welcome_generic")}
        </p>
      </header>

      {/* INFORMACIÓN DE PERFIL EN LA PARTE SUPERIOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("pages.dashboard.age")}
          value={
            age != null
              ? `${age} ${t("pages.dashboard.age_years")}`
              : t("pages.dashboard.not_set")
          }
          subtitle={t("pages.dashboard.age_subtitle")}
          icon={<User2 className="h-5 w-5" />}
        />
        <StatCard
          label={t("pages.dashboard.weight")}
          value={weight != null ? `${weight} kg` : t("pages.dashboard.not_set")}
          subtitle={t("pages.dashboard.weight_subtitle")}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label={t("pages.dashboard.height")}
          value={height != null ? `${height} cm` : t("pages.dashboard.not_set")}
          subtitle={t("pages.dashboard.height_subtitle")}
          icon={<Ruler className="h-5 w-5" />}
        />
        <StatCard
          label={t("pages.dashboard.goal")}
          value={
            goal && goal.trim() !== "" ? goal : t("pages.dashboard.not_set")
          }
          subtitle={t("pages.dashboard.goal_subtitle")}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* OBJECTIF DU JOUR */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm md:text-base">
            {t("pages.dashboard.daily_goal")}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            {t("pages.dashboard.configure_goals")}
          </p>
        </div>
        <Link
          to="/onboarding"
          className="inline-flex justify-center rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 hover:brightness-110 transition"
        >
          {t("pages.dashboard.configure_btn")}
        </Link>
      </div>

      {/* BLOC PRINCIPAL: SÉANCES + RECO IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Séances récentes -> lleva a Recommandations */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-5 flex flex-col justify-between min-h-[200px]">
          <div>
            <h2 className="font-semibold text-slate-900 text-sm md:text-base">
              {t("pages.dashboard.recent_sessions")}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {t("pages.dashboard.recent_sessions_desc")}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-6">
            <span className="text-3xl mb-2 text-slate-300">📋</span>
            <p className="text-xs md:text-sm text-slate-500">
              {t("pages.dashboard.no_sessions")}
            </p>
            <Link
              to="/reco"
              className="mt-2 inline-flex justify-center rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 hover:brightness-110 transition"
            >
              {t("pages.dashboard.view_reco")}
            </Link>
          </div>
        </div>

        {/* Recommandations IA */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-5 flex flex-col justify-between min-h-[200px]">
          <div>
            <h2 className="font-semibold text-slate-900 text-sm md:text-base">
              {t("pages.dashboard.ai_reco")}
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              {t("pages.dashboard.ai_reco_desc")}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
            <span className="text-3xl mb-2 text-fuchsia-500">
              <Brain className="inline h-7 w-7" />
            </span>
            <p className="text-xs md:text-sm text-slate-500 max-w-xs">
              {t("pages.dashboard.ai_reco_text")}
            </p>
            <Link
              to="/chat"
              className="mt-3 inline-flex justify-center rounded-full px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-md bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 hover:brightness-110 transition"
            >
              {t("pages.dashboard.talk_coach")}
            </Link>
          </div>
        </div>
      </div>

      {/* COMPLÉTER / METTRE À JOUR LE PROFIL */}
      <div className="rounded-2xl border border-fuchsia-300 bg-gradient-to-r from-fuchsia-50 via-indigo-50 to-sky-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm md:text-base">
            {profile
              ? t("pages.dashboard.profile_configured")
              : t("pages.dashboard.complete_profile")}
          </h2>
          <p className="text-xs md:text-sm text-slate-700 mt-1">
            {profile
              ? t("pages.dashboard.profile_desc")
              : t("pages.dashboard.profile_desc_empty")}
          </p>
        </div>

        <Link
          to="/onboarding"
          className="inline-flex justify-center rounded-full border border-fuchsia-500 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-fuchsia-700 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:via-indigo-600 hover:to-sky-500 hover:text-white transition"
        >
          {profile
            ? t("pages.dashboard.update_profile")
            : t("pages.dashboard.configure_profile")}
        </Link>
      </div>

      {/* FONCTIONNALITÉS INTELLIGENTES */}
      <section className="pt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          {t("home.features.title")}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          {t("home.features.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chatbot IA Expert -> /chat */}
          <Link to="/chat" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f1_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f1_text")}
              </p>
            </div>
          </Link>

          {/* Recommandations personnalisées -> /reco */}
          <Link to="/reco" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f2_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f2_text")}
              </p>
            </div>
          </Link>

          {/* Suivi de progression -> /tracking */}
          <Link to="/tracking" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f3_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f3_text")}
              </p>
            </div>
          </Link>

          {/* Gamification -> /gamification */}
          <Link to="/gamification" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f4_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f4_text")}
              </p>
            </div>
          </Link>

          {/* Ajustements dynamiques -> /dashboard (Objectif du jour) */}
          <Link to="/dashboard" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f5_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f5_text")}
              </p>
            </div>
          </Link>

          {/* Conseils en temps réel -> /chat */}
          <Link to="/chat" className="block">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-sky-50 flex items-center justify-center text-fuchsia-600">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("home.features.f6_title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                {t("home.features.f6_text")}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </section>
  );
}
