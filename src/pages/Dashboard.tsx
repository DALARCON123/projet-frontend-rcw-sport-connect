import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProfileLocal } from "../services/profileService";
import { User2, Activity, Ruler, Target, Brain, Trophy, Zap, LineChart, MessageSquare } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorScheme: 'purple' | 'blue' | 'emerald' | 'amber';
};

const StatCard = ({ label, value, subtitle, icon, colorScheme }: StatCardProps) => {
  const colorSchemes = {
    purple: {
      border: 'border-purple-200 hover:border-purple-400',
      bg: 'bg-gradient-to-br from-purple-50 via-white to-purple-50/50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      textGradient: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-200/50'
    },
    blue: {
      border: 'border-blue-200 hover:border-blue-400',
      bg: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50/50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      textGradient: 'from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-200/50'
    },
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-400',
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50/50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      textGradient: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-200/50'
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-400',
      bg: 'bg-gradient-to-br from-amber-50 via-white to-orange-50/50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      textGradient: 'from-amber-600 to-orange-600',
      shadow: 'shadow-amber-200/50'
    }
  };

  const scheme = colorSchemes[colorScheme];

  return (
    <div className={`group rounded-2xl ${scheme.bg} shadow-lg hover:shadow-2xl ${scheme.shadow} border-2 ${scheme.border} px-6 py-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
            {label}
          </p>
          <p className={`mt-3 text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${scheme.textGradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-xl ${scheme.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-slate-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-10 space-y-8">
        {/* TÍTULO + BIENVENIDA */}
        <header className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/60">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tableau de Bord
              </h1>
              <p className="mt-1 text-base text-slate-600">
                {name
                  ? `Bienvenue, ${name}! Voici ton espace d'entraînement personnalisé.`
                  : "Bienvenue sur votre espace d'entraînement personnalisé."}
              </p>
            </div>
          </div>
        </header>

      {/* INFORMACIÓN DE PERFIL EN LA PARTE SUPERIOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Âge"
          value={age != null ? `${age} ans` : "Non renseigné"}
          subtitle="Âge actuel utilisé pour adapter les recommandations."
          icon={<User2 className="h-5 w-5" />}
          colorScheme="purple"
        />
        <StatCard
          label="Poids"
          value={weight != null ? `${weight} kg` : "Non renseigné"}
          subtitle="Permet d'estimer l'intensité et les calories brûlées."
          icon={<Activity className="h-5 w-5" />}
          colorScheme="blue"
        />
        <StatCard
          label="Taille"
          value={height != null ? `${height} cm` : "Non renseigné"}
          subtitle="Aide à calculer vos indicateurs corporels."
          icon={<Ruler className="h-5 w-5" />}
          colorScheme="emerald"
        />
        <StatCard
          label="Objectif principal"
          value={goal && goal.trim() !== "" ? goal : "Non renseigné"}
          subtitle="Perte de poids, remise en forme, performance..."
          icon={<Target className="h-5 w-5" />}
          colorScheme="amber"
        />
      </div>

        {/* OBJECTIF DU JOUR */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-white shadow-lg shadow-amber-200/50 border-2 border-amber-200 hover:border-amber-400 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                {t("pages.dashboard.daily_goal")}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {t("pages.dashboard.configure_goals")}
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all hover:scale-105"
          >
            <Zap className="h-4 w-4" />
            {t("pages.dashboard.configure_btn")}
          </Link>
        </div>

        {/* BLOC PRINCIPAL: SÉANCES + RECO IA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Séances récentes */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-white shadow-lg shadow-blue-200/50 hover:shadow-xl border-2 border-blue-200 hover:border-blue-400 px-6 py-6 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <LineChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {t("pages.dashboard.recent_sessions")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("pages.dashboard.recent_sessions_desc")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 py-8">
              <span className="text-5xl mb-3 text-slate-300">📋</span>
              <p className="text-sm text-slate-500 mb-4">
                {t("pages.dashboard.no_sessions")}
              </p>
              <Link
                to="/reco"
                className="inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-105"
              >
                <Activity className="h-4 w-4" />
                {t("pages.dashboard.view_reco")}
              </Link>
            </div>
          </div>

          {/* Recommandations IA */}
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-50 via-pink-50 to-white shadow-lg shadow-fuchsia-200/50 hover:shadow-xl border-2 border-fuchsia-200 hover:border-fuchsia-400 px-6 py-6 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {t("pages.dashboard.ai_reco")}
                </h2>
                <p className="text-sm text-slate-500">
                  {t("pages.dashboard.ai_reco_desc")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
              <span className="text-5xl mb-3">🤖</span>
              <p className="text-sm text-slate-500 max-w-xs mb-4">
                {t("pages.dashboard.ai_reco_text")}
              </p>
              <Link
                to="/chat"
                className="inline-flex justify-center items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 transition-all hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                {t("pages.dashboard.talk_coach")}
              </Link>
            </div>
          </div>
        </div>

        {/* COMPLÉTER / METTRE À JOUR LE PROFIL */}
        <div className="rounded-2xl border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 via-pink-50 to-white shadow-lg shadow-purple-200/50 hover:shadow-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <User2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                {profile ? t("pages.dashboard.profile_configured") : t("pages.dashboard.complete_profile")}
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                {profile
                  ? t("pages.dashboard.profile_desc")
                  : t("pages.dashboard.profile_desc_empty")}
              </p>
            </div>
          </div>

          <Link
            to="/onboarding"
            className="inline-flex justify-center items-center gap-2 rounded-xl border-2 border-purple-500 bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:via-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all hover:scale-105 shadow-md"
          >
            <User2 className="h-4 w-4" />
            {profile ? t("pages.dashboard.update_profile") : t("pages.dashboard.configure_profile")}
          </Link>
        </div>
      </div>
    </section>
  );
}
