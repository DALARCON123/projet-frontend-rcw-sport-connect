import { Link } from "react-router-dom";
import {
  MessageCircle,
  Activity,
  LineChart,
  Trophy,
  Zap,
  MessageSquare,
  Sparkles,
  Heart,
  Dumbbell,
  TrendingUp,
  Brain,
  ArrowRight,
  Star,
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
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0 z-0">
        {/* Patron de fondo (puedes reemplazar con imagen real) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-slate-900/90 to-pink-900/95"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Efectos de fondo decorativos mejorados */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-40 right-1/4 w-[550px] h-[550px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <main className="relative z-10">
        
        {/* HERO - Pantalla Completa con glassmorphism */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Texto izquierda con glassmorphism */}
              <div className="space-y-8">
                {/* Badge superior con glassmorphism */}
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl animate-bounce" style={{animationDuration: '3s'}}>
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  <span className="text-sm font-bold text-white">Intelligence Artificielle Avancée</span>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
                  <span className="text-white drop-shadow-2xl">{t("home.hero.title_1")}</span>
                  {" "}
                  <span className="block mt-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
                    {t("home.hero.title_highlight")}
                  </span>
                  <span className="block mt-3 text-white drop-shadow-2xl">{t("home.hero.title_2")}</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl drop-shadow-lg">
                  {t("home.hero.description")}
                </p>

                {/* Stats con glassmorphism */}
                <div className="flex flex-wrap gap-6">
                  <div className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:bg-white/20 hover:scale-105 transition-all">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Brain className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">IA</p>
                      <p className="text-xs text-white/80">Coach Personnel</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:bg-white/20 hover:scale-105 transition-all">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Activity className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">24/7</p>
                      <p className="text-xs text-white/80">Disponibilité</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:bg-white/20 hover:scale-105 transition-all">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Trophy className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">100%</p>
                      <p className="text-xs text-white/80">Personnalisé</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-6 text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                  >
                    {t("home.hero.start")}
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={scrollToFeatures}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-6 text-xl font-bold border-2 border-white/30 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white shadow-2xl hover:shadow-xl transition-all hover:scale-105"
                  >
                    {t("home.hero.learn_more")}
                    <Sparkles className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Ilustración derecha - Mejorada con glassmorphism */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-2xl">
                  {/* Card principal con glassmorphism */}
                  <div className="relative aspect-square rounded-3xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl overflow-hidden">
                    {/* Efectos internos */}
                    <div className="absolute inset-0">
                      <div className="absolute top-10 right-10 h-48 w-48 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
                      <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-pink-500/30 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>

                    {/* Contenido central */}
                    <div className="relative h-full flex flex-col items-center justify-center p-12 gap-10">
                      {/* Icono principal grande */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                        <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse border-4 border-white/20">
                          <Dumbbell className="h-24 w-24 text-white drop-shadow-2xl" />
                        </div>
                      </div>

                      {/* Grid de iconos secundarios con glassmorphism */}
                      <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                        <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:bg-white/20 transition-all">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Brain className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-xs font-bold text-white">IA Coach</p>
                        </div>
                        <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:bg-white/20 transition-all">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-xs font-bold text-white">Suivi</p>
                        </div>
                        <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:bg-white/20 transition-all">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Heart className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-xs font-bold text-white">Santé</p>
                        </div>
                      </div>

                      {/* Badges con glassmorphism */}
                      <div className="flex flex-wrap justify-center gap-3">
                        <span className="px-5 py-3 rounded-xl bg-white/15 backdrop-blur-xl border-2 border-purple-300/30 text-sm font-bold text-white shadow-lg">
                          {t("home.badges.b1")}
                        </span>
                        <span className="px-5 py-3 rounded-xl bg-white/15 backdrop-blur-xl border-2 border-blue-300/30 text-sm font-bold text-white shadow-lg">
                          {t("home.badges.b2")}
                        </span>
                        <span className="px-5 py-3 rounded-xl bg-white/15 backdrop-blur-xl border-2 border-pink-300/30 text-sm font-bold text-white shadow-lg">
                          {t("home.badges.b3")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Elementos flotantes decorativos mejorados */}
                  <div className="absolute -top-8 -right-8 h-28 w-28 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl animate-bounce border-4 border-white/20" style={{animationDuration: '3s'}}>
                    <Trophy className="h-14 w-14 text-white drop-shadow-xl" />
                  </div>
                  <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-2xl animate-bounce border-4 border-white/20" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
                    <Zap className="h-14 w-14 text-white drop-shadow-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section ref={featuresRef} className="px-6 py-24 bg-white">
          <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-purple-100 border-2 border-purple-300 mb-6 shadow-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">Fonctionnalités Puissantes</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent mb-6">
                {t("home.features.title")}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {t("home.features.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<MessageCircle className="h-6 w-6" />}
                title={t("home.features.f1_title")}
                text={t("home.features.f1_text")}
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureCard
                icon={<Activity className="h-6 w-6" />}
                title={t("home.features.f2_title")}
                text={t("home.features.f2_text")}
                gradient="from-blue-500 to-cyan-500"
              />
              <FeatureCard
                icon={<LineChart className="h-6 w-6" />}
                title={t("home.features.f3_title")}
                text={t("home.features.f3_text")}
                gradient="from-emerald-500 to-teal-500"
              />
              <FeatureCard
                icon={<Trophy className="h-6 w-6" />}
                title={t("home.features.f4_title")}
                text={t("home.features.f4_text")}
                gradient="from-amber-500 to-orange-500"
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title={t("home.features.f5_title")}
                text={t("home.features.f5_text")}
                gradient="from-fuchsia-500 to-pink-500"
              />
              <FeatureCard
                icon={<MessageSquare className="h-6 w-6" />}
                title={t("home.features.f6_title")}
                text={t("home.features.f6_text")}
                gradient="from-violet-500 to-purple-500"
              />
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-6 py-24 bg-gradient-to-b from-white to-slate-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-12 py-20 overflow-hidden shadow-2xl">
              {/* Efectos decorativos */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 text-white">
                <div className="text-center md:text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-xl">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-base font-bold">Commencez Gratuitement</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold drop-shadow-2xl">
                    {t("home.cta.title")}
                  </h2>
                  <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                    {t("home.cta.subtitle")}
                  </p>
                </div>

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-6 text-xl font-bold bg-white text-purple-700 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 whitespace-nowrap"
                >
                  {t("home.cta.button")}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-6 py-8 text-sm text-slate-600 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-pink-500 fill-pink-500 animate-pulse" />
            <span className="font-bold text-lg text-slate-800">Fait avec passion</span>
          </div>
          <p className="text-base font-semibold text-slate-700">© 2025 FIAI – Système de Recommandation d'Activités Physiques.</p>
          <p className="text-sm mt-2 text-slate-600">Développé par <span className="font-bold text-purple-600">Diana Alarcon</span>- <span className="font-bold text-purple-600">Ana Claudia</span> & <span className="font-bold text-purple-600">Lucas</span>.</p>
        </div>
      </footer>
    </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  gradient: string;
};

function FeatureCard({ icon, title, text, gradient }: FeatureProps) {
  return (
    <div className="group rounded-2xl border-2 border-white/60 bg-gradient-to-br from-white via-white to-slate-50/30 backdrop-blur-sm px-6 py-6 flex flex-col gap-4 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-700 transition-colors">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}
