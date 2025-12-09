import { Sparkles, Dumbbell, Heart, Zap, TrendingUp, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AuthLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Efectos decorativos espectaculares */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-400 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Iconos flotantes decorativos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <Dumbbell className="absolute top-20 left-20 h-12 w-12 text-purple-600 animate-bounce" style={{animationDuration: '3s'}} />
        <Heart className="absolute top-40 right-32 h-10 w-10 text-pink-600 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}} />
        <Zap className="absolute bottom-40 left-32 h-10 w-10 text-blue-600 animate-bounce" style={{animationDuration: '2.8s', animationDelay: '1s'}} />
        <Trophy className="absolute bottom-20 right-20 h-12 w-12 text-amber-600 animate-bounce" style={{animationDuration: '3.2s', animationDelay: '1.5s'}} />
      </div>

      {/* contenu principal */}
      <main className="relative z-10 w-full min-h-screen py-12 px-6 pb-16 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* Illustration motivante mejorada */}
        <div className="order-2 md:order-1 space-y-6">
          <div className="group relative">
            {/* Card principal con gradiente */}
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-white/60 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 hover:shadow-purple-300/50 hover:scale-[1.02]">
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                    <Dumbbell className="h-10 w-10 text-white" />
                  </div>
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}>
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent mb-3">
                  {t("auth.hero.title")}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed max-w-md">
                  {t("auth.hero.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Features cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="group rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 p-4 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-700">Progrès IA</p>
            </div>
            <div className="group rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-4 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-700">Coaching</p>
            </div>
            <div className="group rounded-2xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 p-4 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-700">Objectifs</p>
            </div>
          </div>
        </div>

        {/* formulaire amélioré */}
        <div className="order-1 md:order-2">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <p className="text-slate-600 ml-15">Accédez à votre espace d'entraînement personnalisé</p>
          </div>
          
          <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl shadow-2xl border-2 border-white/60 hover:shadow-purple-300/30 transition-all duration-300">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
