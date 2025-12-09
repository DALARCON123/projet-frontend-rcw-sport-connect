import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Zap,
  Heart,
  Activity,
  Trophy,
  Star
} from "lucide-react";

import {
  getProfileLocal,
  saveProfileLocal
} from "../services/profileService";

import type { Profile } from "../services/profileService";

export default function Onboarding() {
  const navigate = useNavigate();
  const existing = getProfileLocal();

  const [form, setForm] = useState<Profile>({
    age: existing?.age ?? undefined,
    weightKg: existing?.weightKg ?? undefined,
    heightCm: existing?.heightCm ?? undefined,
    goal: existing?.goal ?? "",
    daysPerWeek: existing?.daysPerWeek ?? 3,
    minutesPerSession: existing?.minutesPerSession ?? 30,
    level: existing?.level ?? "debutant",
  });

  const handleNum = (field: keyof Profile) => (e: any) => {
    const val = e.target.value === "" ? undefined : Number(e.target.value);
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleText = (field: keyof Profile) => (e: any) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    saveProfileLocal(form);
    navigate("/dashboard");
  };

  const isEdit = !!existing;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Fondo con efectos deportivos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-slate-900/90"></div>
        
        {/* Patrón geométrico */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Efectos de luz */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-40 left-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Iconos flotantes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <Trophy className="absolute top-20 left-20 h-12 w-12 text-amber-300 animate-bounce" style={{animationDuration: '3s'}} />
        <Heart className="absolute top-32 right-32 h-10 w-10 text-pink-300 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}} />
        <Zap className="absolute bottom-40 left-40 h-10 w-10 text-yellow-300 animate-bounce" style={{animationDuration: '2.8s', animationDelay: '1s'}} />
        <Star className="absolute bottom-32 right-40 h-12 w-12 text-cyan-300 animate-bounce" style={{animationDuration: '3.2s', animationDelay: '1.5s'}} />
      </div>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        
        {/* Header espectacular */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/20">
            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            <span className="text-white font-semibold text-lg">
              Configuration Intelligente
            </span>
            <Activity className="h-6 w-6 text-cyan-300 animate-pulse" />
          </div>
          
          <h1 className="text-6xl font-black text-white drop-shadow-2xl mb-4">
            {isEdit ? "Mettre à jour mon profil" : "Créer mon profil"}
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto">
            Personnalisez votre expérience fitness avec l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panel lateral con estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card de motivación */}
            <div className="group bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20 hover:border-white/40 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">Votre Journey</h3>
                  <p className="text-sm text-white/80">Commence ici</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Complétez votre profil pour recevoir des recommandations personnalisées par IA
              </p>
            </div>

            {/* Features mini cards */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Analyse IA</p>
                    <p className="text-white/70 text-xs">Recommandations intelligentes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Objectifs Personnalisés</p>
                    <p className="text-white/70 text-xs">Adaptés à votre niveau</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Suivi Santé</p>
                    <p className="text-white/70 text-xs">Progression en temps réel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/30 p-8 space-y-8"
            >
              
              {/* Información Personal */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Informations Personnelles</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <User className="h-4 w-4 text-purple-500" />
                      Âge
                    </label>
                    <input
                      type="number"
                      value={form.age ?? ""}
                      onChange={handleNum("age")}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                      placeholder="30"
                    />
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={form.weightKg ?? ""}
                      onChange={handleNum("weightKg")}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      placeholder="70"
                    />
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      Taille (cm)
                    </label>
                    <input
                      type="number"
                      value={form.heightCm ?? ""}
                      onChange={handleNum("heightCm")}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
                      placeholder="165"
                    />
                  </div>
                </div>
              </div>

              {/* Objectif */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Objectif Principal</h2>
                </div>

                <select
                  value={form.goal || ""}
                  onChange={handleText("goal")}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base font-medium focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all bg-white"
                >
                  <option value="">Choisir votre objectif…</option>
                  <option value="Perte de poids">🔥 Perte de poids</option>
                  <option value="Remise en forme">💪 Remise en forme</option>
                  <option value="Prise de masse">🏋️ Prise de masse</option>
                  <option value="Bien-être général">🧘 Bien-être général</option>
                </select>
              </div>

              {/* Niveau */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Niveau Actuel</h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { level: "debutant", label: "Débutant", icon: "🌱", color: "emerald" },
                    { level: "intermediaire", label: "Intermédiaire", icon: "🔥", color: "orange" },
                    { level: "avance", label: "Avancé", icon: "⚡", color: "purple" }
                  ].map(({ level, label, icon, color }) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, level: level as Profile["level"] }))
                      }
                      className={`group relative px-5 py-4 rounded-2xl border-2 font-semibold transition-all hover:scale-[1.05] ${
                        form.level === level
                          ? `bg-gradient-to-br from-${color}-500 to-${color}-600 text-white border-${color}-400 shadow-lg shadow-${color}-500/50`
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-sm">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fréquence */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Fréquence d'Entraînement</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Jours / semaine
                    </label>
                    <input
                      type="number"
                      value={form.daysPerWeek ?? ""}
                      onChange={handleNum("daysPerWeek")}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base font-semibold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      min="1"
                      max="7"
                    />
                  </div>

                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Clock className="h-4 w-4 text-cyan-500" />
                      Minutes / séance
                    </label>
                    <input
                      type="number"
                      value={form.minutesPerSession ?? ""}
                      onChange={handleNum("minutesPerSession")}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base font-semibold focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all"
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all hover:scale-[1.02] shadow-sm"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="flex-1 group px-6 py-4 rounded-xl text-white font-bold text-base 
                    bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 
                    hover:from-purple-500 hover:via-pink-500 hover:to-orange-400
                    shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all
                    flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  {isEdit ? "Enregistrer les modifications" : "Créer mon profil"}
                  <Zap className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

      </section>
    </div>
  );
}
