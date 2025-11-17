import { Link } from "react-router-dom";
import {
  MessageCircle,
  Activity,
  LineChart,
  Trophy,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto izquierda */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {t("home.hero.title_1")}{" "}
              <span className="bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                {t("home.hero.title_highlight")}
              </span>
              <br />
              {t("home.hero.title_2")}
            </h1>

            <p className="mt-6 text-slate-700 leading-relaxed text-sm md:text-base">
              {t("home.hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 hover:brightness-110 transition shadow-lg"
              >
                {t("home.hero.start")}
              </Link>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-semibold border border-slate-300 bg-white/80 hover:bg-white shadow-sm transition"
              >
                {t("home.hero.learn_more")}
              </button>
            </div>
          </div>

          {/* Ilustración derecha */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 border border-white/70 shadow-xl flex items-center justify-center relative overflow-hidden">

              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />
              <div className="absolute -bottom-10 -left-16 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />

              <div className="relative flex flex-col items-center gap-4">
                
                {/* Icono principal */}
                <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-fuchsia-500 via-indigo-500 to-sky-500 flex items-center justify-center shadow-xl">
                  <svg
                    viewBox="0 0 64 64"
                    className="h-16 w-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="42" cy="14" r="4" />
                    <path d="M30 54l7-16-8-8-9 6" />
                    <path d="M32 24l6-6 8 4" />
                    <path d="M18 40l-6 4" />
                    <path d="M34 38l10 6" />
                    <path d="M10 26h-4" />
                    <path d="M10 32h-6" />
                    <path d="M10 38H4" />
                  </svg>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2 text-[11px]">
                  <span className="px-3 py-1 rounded-full bg-white/80 text-slate-700 shadow-sm border border-slate-100">
                    {t("home.badges.b1")}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/80 text-slate-700 shadow-sm border border-slate-100">
                    {t("home.badges.b2")}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/80 text-slate-700 shadow-sm border border-slate-100">
                    {t("home.badges.b3")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section ref={featuresRef}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {t("home.features.title")}
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title={t("home.features.f1_title")}
              text={t("home.features.f1_text")}
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6" />}
              title={t("home.features.f2_title")}
              text={t("home.features.f2_text")}
            />
            <FeatureCard
              icon={<LineChart className="h-6 w-6" />}
              title={t("home.features.f3_title")}
              text={t("home.features.f3_text")}
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title={t("home.features.f4_title")}
              text={t("home.features.f4_text")}
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title={t("home.features.f5_title")}
              text={t("home.features.f5_text")}
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title={t("home.features.f6_title")}
              text={t("home.features.f6_text")}
            />
          </div>
        </section>

        {/* CTA FINAL */}
        <section>
          <div className="rounded-3xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("home.cta.title")}
              </h2>
              <p className="mt-2 text-sm md:text-base text-white/90 max-w-xl">
                {t("home.cta.subtitle")}
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-semibold bg-white text-fuchsia-700 hover:bg-slate-50 transition shadow-md"
            >
              {t("home.cta.button")}
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 mt-10 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs md:text-sm text-slate-500 text-center">
          © 2025 FIAI – Système de Recommandation d'Activités Physiques.  
          Développé par Diana Alarcon & Ana Claudia.
        </div>
      </footer>
    </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function FeatureCard({ icon, title, text }: FeatureProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 flex gap-3 items-start shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
      <div className="mt-1">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-400 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
