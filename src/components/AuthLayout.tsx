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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-900 via-green-900 to-orange-900">
      {/* Fondo con patrón geométrico deportivo */}
      <div className="absolute inset-0 z-0">
        {/* Gradiente overlay deportivo - colores de energía y vitalidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-green-900/85 to-orange-900/90"></div>
        
        {/* Patrón geométrico deportivo */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        ></div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Efectos decorativos con colores deportivos */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-green-500 to-emerald-500 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-orange-500 to-amber-500 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Iconos flotantes deportivos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <Dumbbell className="absolute top-20 left-20 h-16 w-16 text-orange-300 animate-bounce" style={{animationDuration: '3s'}} />
        <Heart className="absolute top-40 right-32 h-14 w-14 text-green-300 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}} />
        <Zap className="absolute bottom-40 left-32 h-14 w-14 text-blue-300 animate-bounce" style={{animationDuration: '2.8s', animationDelay: '1s'}} />
        <Trophy className="absolute bottom-20 right-20 h-16 w-16 text-amber-300 animate-bounce" style={{animationDuration: '3.2s', animationDelay: '1.5s'}} />
        <Sparkles className="absolute top-1/2 left-10 h-12 w-12 text-cyan-300 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}} />
        <TrendingUp className="absolute top-1/4 right-10 h-12 w-12 text-emerald-300 animate-bounce" style={{animationDuration: '3s', animationDelay: '1.2s'}} />
      </div>

      {/* contenu principal */}
      <main className="relative z-10 w-full min-h-screen py-12 px-6 pb-16 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* Illustration motivante mejorada */}
        <div className="order-2 md:order-1 space-y-6">
          <div className="group relative">
            {/* Card principal con glassmorphism sobre fondo oscuro */}
            <div className="relative aspect-[4/3] rounded-3xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-purple-500/50 hover:scale-[1.02] hover:border-white/30">
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Efectos internos */}
              <div className="absolute inset-0">
                <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
                <div className="mb-8 flex items-center justify-center gap-5">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-pulse border-4 border-white/30">
                    <Dumbbell className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl animate-pulse border-4 border-white/30" style={{animationDelay: '0.5s'}}>
                    <Heart className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-white drop-shadow-2xl mb-4">
                  {t("auth.hero.title")}
                </h2>
                <p className="text-white/90 text-lg leading-relaxed max-w-md drop-shadow-lg">
                  {t("auth.hero.subtitle")}
                </p>
                
                {/* Elemento decorativo */}
                <div className="mt-6 flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-xl border-2 border-white/25 shadow-xl">
                  <Sparkles className="h-5 w-5 text-purple-300 animate-pulse" />
                  <span className="text-sm font-bold text-white">Technologie IA de Pointe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features cards mejoradas con glassmorphism */}
          <div className="grid grid-cols-3 gap-4">
            <div className="group rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-purple-400/50 hover:bg-white/15 p-5 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="h-14 w-14 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm font-bold text-white">Progrès IA</p>
              <p className="text-xs text-white/80 mt-1">Analyse avancée</p>
            </div>
            <div className="group rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/15 p-5 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="h-14 w-14 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm font-bold text-white">Coaching</p>
              <p className="text-xs text-white/80 mt-1">24/7 disponible</p>
            </div>
            <div className="group rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-amber-400/50 hover:bg-white/15 p-5 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="h-14 w-14 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm font-bold text-white">Objectifs</p>
              <p className="text-xs text-white/80 mt-1">100% personnalisés</p>
            </div>
          </div>

          {/* Estadísticas adicionales con glassmorphism */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg">5000+</p>
                <p className="text-xs text-white/80 mt-2 font-medium">Utilisateurs Actifs</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg">98%</p>
                <p className="text-xs text-white/80 mt-2 font-medium">Satisfaction</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center flex-1">
                <p className="text-4xl font-bold text-white drop-shadow-lg">24/7</p>
                <p className="text-xs text-white/80 mt-2 font-medium">Support IA</p>
              </div>
            </div>
          </div>
        </div>

        {/* formulaire amélioré */}
        <div className="order-1 md:order-2">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
                {title}
              </h1>
            </div>
            <p className="text-white/90 ml-17 text-lg drop-shadow-lg">Accédez à votre espace d'entraînement personnalisé</p>
          </div>
          
          <div className="rounded-3xl p-8 bg-white/95 backdrop-blur-2xl shadow-2xl border-2 border-white/40 hover:shadow-purple-500/30 transition-all duration-300">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
