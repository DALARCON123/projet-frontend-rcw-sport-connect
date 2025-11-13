import { Link } from "react-router-dom";
import { HeartPulse, Brain, Dumbbell, Shield, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* blobs decorativos */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm border border-white/60 shadow-sm">
            <Sparkles className="h-4 w-4" />
            {t("home.badge")}
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            {t("home.title")}
          </h1>

          <p className="mt-4 text-slate-600 leading-relaxed">
            {t("home.subtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/register"
              className="inline-flex justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-sky-600 hover:opacity-95 transition shadow-lg"
            >
              {t("home.register")}
            </Link>
            <Link
              to="/login"
              className="inline-flex justify-center rounded-xl px-6 py-3 font-semibold border border-slate-300/70 bg-white/70 hover:bg-white transition"
            >
              {t("home.login")}
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">{t("home.disclaimer")}</p>
        </div>

        {/* Ilustración / placeholder */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="aspect-[4/3] rounded-3xl bg-white/70 border border-white/60 shadow-xl grid place-items-center">
            <div className="text-slate-500 text-center px-6">
              <div className="text-6xl mb-4">🏃‍♀️🏃‍♂️</div>
              <p className="font-medium">
                SportConnectIA — AI & Health Assistant
              </p>
              <p className="text-sm mt-1">Your journey to a better you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
          {t("home.benefits")}
        </h2>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={<HeartPulse className="h-5 w-5" />} title={t("home.b1title")} text={t("home.b1text")} />
          <Card icon={<Brain className="h-5 w-5" />} title={t("home.b2title")} text={t("home.b2text")} />
          <Card icon={<Dumbbell className="h-5 w-5" />} title={t("home.b3title")} text={t("home.b3text")} />
          <Card icon={<Shield className="h-5 w-5" />} title={t("home.b4title")} text={t("home.b4text")} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/70 bg-white/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} SportConnectIA</span>
          <span className="text-center">{t("home.footer")}</span>
        </div>
      </footer>
    </div>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex items-start gap-3">
      <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-sky-500 text-white">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{text}</p>
      </div>
    </div>
  );
}
