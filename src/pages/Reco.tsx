// src/pages/Reco.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Apple,
  Brain,
  History,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Profile = {
  name?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  mainGoal?: string;
  lang?: string;
  // por si un día guardas el email del usuario en Firestore
  email?: string;
};

type RecoItem = {
  id: string;
  answer: string;
  createdAt?: { seconds: number; nanoseconds: number } | string;
};

type ParsedSection = {
  title: string;
  bullets: string[];
};

type Measurement = {
  id: number;
  date: string;
  weight_kg?: number | null;
  waist_cm?: number | null;
  hips_cm?: number | null;
  chest_cm?: number | null;
  notes?: string | null;
};

// 🔗 URL del microservicio de recomendaciones & tracking
// En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const isDev = import.meta.env.DEV;
const API_URL = isDev ? "" : (import.meta.env.VITE_RECO_URL ?? "http://localhost:8003");

/**
 * Parsea el texto plano generado por la IA (con **títulos** y *viñetas)
 * en un arreglo de secciones estructuradas para poder mostrar tarjetas.
 */
function parseRecoToSections(text: string): ParsedSection[] {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    // Línea tipo **Titre:**
    if (line.startsWith("**") && line.includes("**", 2)) {
      const cleanTitle = line
        .replace(/\*\*/g, "")
        .replace(/:+$/, "")
        .trim();

      if (current) sections.push(current);
      current = { title: cleanTitle || "Plan", bullets: [] };
    }
    // Línea tipo * viñeta
    else if (line.startsWith("*")) {
      const bullet = line
        .replace(/^\*+/, "")
        .trim()
        .replace(/^\*/, "")
        .trim();
      if (!current) current = { title: "Plan", bullets: [] };
      if (bullet) current.bullets.push(bullet);
    } else {
      // Texto suelto → bullet adicional
      if (!current) current = { title: "Plan", bullets: [] };
      current.bullets.push(line);
    }
  }

  if (current) sections.push(current);
  return sections;
}

export default function RecoPage() {
  const { t, i18n } = useTranslation();

  // Obtener el user_id del token JWT (sub) o del email guardado
  const getUserId = (): string => {
    // Intentar obtener del token JWT
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        
        // Preferir sub (subject) del JWT, sino email
        return payload.sub || payload.email || payload.user_id || "";
      } catch {
        // Si falla el parse, continuar con email
      }
    }
    
    // Fallback: usar email guardado
    return localStorage.getItem("user_email") || "";
  };

  const userId = getUserId();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestReco, setLatestReco] = useState<string>("");
  const [history, setHistory] = useState<RecoItem[]>([]);
  const [loadingReco, setLoadingReco] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Tracking & gráficos ----
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [savingMeasurement, setSavingMeasurement] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [measureDate, setMeasureDate] = useState(today);
  const [measureWeight, setMeasureWeight] = useState("");
  const [measureWaist, setMeasureWaist] = useState("");
  const [measureHips, setMeasureHips] = useState("");
  const [measureChest, setMeasureChest] = useState("");
  const [measureNotes, setMeasureNotes] = useState("");

  // key que usamos para el tracking en SQLite (puede ser email o uid)
  const trackingKey = (profile?.email || userId).toLowerCase();

  // -------- Helpers --------

  function formatDate(v?: any) {
    if (!v) return "";
    if (typeof v === "object" && v.seconds != null) {
      const d = new Date(v.seconds * 1000);
      return d.toLocaleString();
    }
    return String(v);
  }

  const sections: ParsedSection[] = useMemo(
    () => parseRecoToSections(latestReco),
    [latestReco]
  );

  const chartData = useMemo(() => {
    if (!measurements || measurements.length === 0) return [];
    const sorted = [...measurements].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return sorted.map((m) => ({
      ...m,
      // etiqueta más corta en el eje X
      label: m.date,
    }));
  }, [measurements]);

  const latestMeasure =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const prevMeasure =
    chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const deltaWeight =
    latestMeasure?.weight_kg != null && prevMeasure?.weight_kg != null
      ? latestMeasure.weight_kg - prevMeasure.weight_kg
      : null;

  // -------- Cargar perfil desde localStorage al inicio --------
  useEffect(() => {
    const storedProfile = localStorage.getItem("profile_v1");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile({
          name: localStorage.getItem("user_name") || undefined,
          email: localStorage.getItem("user_email") || undefined,
          age: parsed.age,
          weightKg: parsed.weightKg,
          heightCm: parsed.heightCm,
          mainGoal: parsed.goal,
          lang: i18n.language,
        });
      } catch (e) {
        console.error("Error parsing profile:", e);
      }
    }
  }, [i18n.language]);

  // -------- Cargar historial al entrar --------
  useEffect(() => {
    if (!userId) return;
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Cargar medidas cuando tengamos trackingKey
  useEffect(() => {
    if (!trackingKey) return;
    loadMeasurements(trackingKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingKey]);

  async function loadHistory() {
    try {
      setLoadingHistory(true);
      setError(null);

      const resp = await fetch(`${API_URL}/reco/history/${userId}`);
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error HTTP " + resp.status);
      }

      const data: any[] = await resp.json();

      const mapped: RecoItem[] = data.map((d: any) => ({
        id: d.id,
        answer: d.answer,
        createdAt: d.createdAt,
      }));

      setHistory(mapped);
      if (mapped.length > 0) {
        setLatestReco(mapped[0].answer || "");
        setProfile((p) => ({ ...(p || {}), ...(data[0].profile || {}) }));
      }
    } catch (e: any) {
      console.error("Erreur loadHistory:", e);
      setError("Impossible de charger l'historique des recommandations.");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadMeasurements(email: string) {
    try {
      setLoadingMeasurements(true);
      setTrackingError(null);

      const resp = await fetch(
        `${API_URL}/tracking/measurements?email=${encodeURIComponent(
          email
        )}`
      );
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error HTTP " + resp.status);
      }
      const data: Measurement[] = await resp.json();
      setMeasurements(data || []);
    } catch (e: any) {
      console.error("Erreur loadMeasurements:", e);
      setTrackingError(
        "Impossible de charger les mesures de suivi. Réessaie plus tard."
      );
    } finally {
      setLoadingMeasurements(false);
    }
  }

  // -------- Generar nueva recomendación --------
  async function handleGenerate() {
    if (!userId) {
      setError("Utilisateur introuvable (uid manquant).");
      return;
    }

    // Verificar que tenemos perfil completo
    const localProfile = localStorage.getItem("profile_v1");
    if (!localProfile) {
      setError("Tu perfil no está completo. Ve a 'Perfil' pour le compléter.");
      return;
    }

    try {
      setLoadingReco(true);
      setError(null);

      const profileData = JSON.parse(localProfile);
      
      // Construir el objeto de perfil para enviar al backend
      const requestBody = {
        user_id: userId,
        lang: i18n.language,
        age: profileData.age || 30,
        weight_kg: profileData.weightKg || 70,
        height_cm: profileData.heightCm || 170,
        main_goal: profileData.goal || "Perte de poids",
        days_per_week: profileData.daysPerWeek || 3,
        minutes_per_session: profileData.minutesPerSession || 45,
        level: profileData.level || "debutant",
      };

      console.log("🔍 Generando recomendación con:", requestBody);

      const resp = await fetch(`${API_URL}/reco/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("❌ Error del servidor:", text);
        throw new Error(text || "Error HTTP " + resp.status);
      }

      const data = await resp.json();
      console.log("✅ Respuesta recibida:", data);

      const answer: string = data.answer || "";
      setLatestReco(answer);
      setProfile(data.profile || null);

      await loadHistory();
    } catch (e: any) {
      console.error("Erreur handleGenerate:", e);
      setError(
        "Une erreur est survenue lors de la génération des recommandations. Détails: " + e.message
      );
    } finally {
      setLoadingReco(false);
    }
  }

  // -------- Guardar una nueva medida --------
  async function handleSaveMeasurement(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingKey) {
      setTrackingError("Utilisateur introuvable pour le suivi.");
      return;
    }
    if (!measureDate) {
      setTrackingError("La date est obligatoire.");
      return;
    }

    try {
      setSavingMeasurement(true);
      setTrackingError(null);

      const body = {
        date: measureDate,
        weight_kg: measureWeight ? parseFloat(measureWeight) : null,
        waist_cm: measureWaist ? parseFloat(measureWaist) : null,
        hips_cm: measureHips ? parseFloat(measureHips) : null,
        chest_cm: measureChest ? parseFloat(measureChest) : null,
        notes: measureNotes || null,
      };

      const resp = await fetch(
        `${API_URL}/tracking/measurements?email=${encodeURIComponent(
          trackingKey
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error HTTP " + resp.status);
      }

      // limpiar campos (menos fecha)
      setMeasureWeight("");
      setMeasureWaist("");
      setMeasureHips("");
      setMeasureChest("");
      setMeasureNotes("");

      await loadMeasurements(trackingKey);
    } catch (e: any) {
      console.error("Erreur handleSaveMeasurement:", e);
      setTrackingError(
        "Erreur lors de l’enregistrement de la mesure. Vérifie les valeurs."
      );
    } finally {
      setSavingMeasurement(false);
    }
  }

  // -------- UI --------
  const displayProfile: Profile = profile || {
    name: "SportConnectIA",
    age: 39,
    weightKg: 64,
    heightCm: 160,
    mainGoal: "Perte de poids",
  };

  const sectionGradients = [
    "from-fuchsia-50/90 via-white to-sky-50",
    "from-emerald-50/90 via-white to-sky-50",
    "from-amber-50/90 via-white to-rose-50",
    "from-sky-50/90 via-white to-violet-50",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-6 lg:px-8 py-10">
      {/* Header espectacular con fondo degradado */}
      <header className="max-w-[1600px] mx-auto mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 shadow-2xl border-2 border-white/30">
          {/* Patrón de fondo */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-white/30">
                <Sparkles className="text-white h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-white drop-shadow-2xl">
                  {t("pages.reco.title") || "Recommandations IA"}
                </h1>
                <p className="text-lg text-white/95 drop-shadow-lg mt-2 max-w-2xl">
                  {t("pages.reco.subtitle") ||
                    "Coach intelligent • Plan personnalisé • Résultats garantis"}
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loadingReco}
              className="group inline-flex items-center gap-3 rounded-2xl bg-white hover:bg-white/95 px-8 py-4 text-base font-bold text-purple-600 shadow-2xl hover:shadow-white/50 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all"
            >
              {loadingReco ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Brain className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              )}
              {t("pages.reco.generate") || "Générer mon plan IA"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto space-y-8">
        {/* Perfil + métricas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProfileCard
            title={t("pages.reco.age") || "Âge"}
            icon={<Activity className="h-5 w-5" />}
            value={
              displayProfile.age != null ? `${displayProfile.age} ans` : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.weight") || "Poids"}
            icon={<Activity className="h-5 w-5" />}
            value={
              displayProfile.weightKg != null
                ? `${displayProfile.weightKg} kg`
                : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.height") || "Taille"}
            icon={<Activity className="h-5 w-5" />}
            value={
              displayProfile.heightCm != null
                ? `${displayProfile.heightCm} cm`
                : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.mainGoal") || "Objectif principal"}
            icon={<Apple className="h-5 w-5" />}
            value={displayProfile.mainGoal || "—"}
          />
        </section>

        {/* Recomendación actual en tarjetas */}
        <section className="rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 shadow-2xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                {t("pages.reco.latest") || "Ton Plan Personnalisé"}
              </h2>
              <p className="text-sm text-slate-600 mt-1">Généré par l'intelligence artificielle</p>
            </div>
          </div>

          {!latestReco ? (
            loadingReco ? (
              <p className="text-sm text-slate-500">
                {t("pages.reco.loading") ||
                  "Génération des recommandations..."}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                {t("pages.reco.empty") ||
                  "Clique sur le bouton ci-dessus pour générer tes premières recommandations."}
              </p>
            )
          ) : sections.length === 0 ? (
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {latestReco}
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {sections.map((sec, idx) => {
                  const gradient =
                    sectionGradients[idx % sectionGradients.length];
                  const isLast = idx === sections.length - 1;

                  const cardColors = [
                    { accent: 'from-purple-500 to-pink-500', icon: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
                    { accent: 'from-blue-500 to-cyan-500', icon: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
                    { accent: 'from-emerald-500 to-teal-500', icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
                    { accent: 'from-amber-500 to-orange-500', icon: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
                  ];
                  
                  const cardColor = cardColors[idx % cardColors.length];
                  
                  return (
                    <div
                      key={`${sec.title}-${idx}`}
                      className={`group relative h-full overflow-hidden rounded-3xl border-2 ${cardColor.border} bg-gradient-to-br ${gradient} px-7 py-6 text-sm text-slate-800 shadow-xl hover:shadow-2xl backdrop-blur-sm flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                        isLast ? "lg:col-span-3" : ""
                      }`}
                    >
                      <span className={`absolute left-0 top-8 h-16 w-1.5 rounded-r-full bg-gradient-to-b ${cardColor.accent} shadow-lg`} />

                      <div className="pl-4">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${cardColor.icon} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                            <Sparkles className="h-5 w-5" />
                          </span>
                          {sec.title || "Plan"}
                        </h3>

                        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed flex-1">
                          {sec.bullets.map((b, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="mt-[6px] h-2 w-2 rounded-full bg-purple-500/70 shrink-0 shadow-sm" />
                              <span className="text-slate-700">{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 pt-3 border-t border-purple-200/50 text-xs text-slate-500 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                          <span className="font-medium">Coach IA • SportConnectIA</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-400 mt-1">
                ⚠ Ces recommandations sont indicatives et ne remplacent
                pas l’avis d’un professionnel de la santé. Adapte toujours
                l’intensité à ton niveau et à ton ressenti.
              </p>
            </>
          )}
        </section>

        {/* Seguimiento & gráficos */}
        <section className="grid md:grid-cols-2 gap-6 items-start">
          {/* Formulario de seguimiento */}
          <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-2xl p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Suivi de ton Évolution
                </h2>
                <p className="text-sm text-slate-600">Enregistre tes progrès</p>
              </div>
            </div>

            {trackingError && (
              <p className="text-xs text-red-500 mb-2">{trackingError}</p>
            )}

            <form
              onSubmit={handleSaveMeasurement}
              className="space-y-4 text-sm text-slate-700"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-lg bg-purple-100 grid place-items-center text-purple-600 text-xs">????</span>
                    Date
                  </label>
                  <input
                    type="date"
                    value={measureDate}
                    onChange={(e) => setMeasureDate(e.target.value)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureWeight}
                    onChange={(e) => setMeasureWeight(e.target.value)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Ex: 64.5"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    Tour de taille (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureWaist}
                    onChange={(e) => setMeasureWaist(e.target.value)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Ex: 80"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    Tour de hanches (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureHips}
                    onChange={(e) => setMeasureHips(e.target.value)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Ex: 95"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm text-slate-700">
                    Tour de poitrine (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureChest}
                    onChange={(e) => setMeasureChest(e.target.value)}
                    className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    placeholder="Ex: 90"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-slate-700">
                  Notes (comment tu te sens, séance, etc.)
                </label>
                <textarea
                  value={measureNotes}
                  onChange={(e) => setMeasureNotes(e.target.value)}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[80px]"
                  placeholder="Ex: Séance facile, bonne énergie…"
                />
              </div>

              <button
                type="submit"
                disabled={savingMeasurement}
                className="group mt-6 w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 px-8 py-4 text-base font-bold text-white shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 transition-all"
              >
                {savingMeasurement ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                )}
                Enregistrer la mesure
              </button>

              {loadingMeasurements && (
                <p className="text-[10px] text-slate-400 mt-1">
                  Chargement des mesures…
                </p>
              )}
            </form>
          </div>

          {/* Gráficos */}
          <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                  <History className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Graphique d'Évolution
                  </h2>
                  <p className="text-sm text-slate-600">Visualise tes progrès</p>
                </div>
              </div>
              {latestMeasure && (
                <div className="text-[10px] text-slate-500 text-right">
                  <p>
                    Dernier poids:{" "}
                    <span className="font-semibold">
                      {latestMeasure.weight_kg ?? "—"} kg
                    </span>{" "}
                    le {latestMeasure.date}
                  </p>
                  {deltaWeight != null && (
                    <p>
                      Différence vs mesure précédente:{" "}
                      <span
                        className={
                          deltaWeight < 0
                            ? "text-emerald-600 font-semibold"
                            : deltaWeight > 0
                            ? "text-rose-600 font-semibold"
                            : "font-semibold"
                        }
                      >
                        {deltaWeight > 0 ? "+" : ""}
                        {deltaWeight.toFixed(1)} kg
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {chartData.length === 0 ? (
              <p className="text-xs text-slate-500">
                Aucune mesure enregistrée pour le moment. Ajoute une
                première mesure dans le formulaire à gauche.
              </p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip
                      contentStyle={{ fontSize: "11px" }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={24}
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight_kg"
                      name="Poids (kg)"
                      dot={{ r: 3 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="waist_cm"
                      name="Taille (cm)"
                      dot={false}
                      strokeWidth={1.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="hips_cm"
                      name="Hanches (cm)"
                      dot={false}
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* Historial de recomendaciones IA */}
        <section className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
                <History className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t("pages.reco.historyTitle") ||
                    "Historique de tes Recommandations"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">Toutes tes générations précédentes</p>
              </div>
            </div>
            {loadingHistory && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t("pages.reco.loadingHistory") || "Mise à jour..."}
              </span>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-3">{error}</p>
          )}

          {history.length === 0 ? (
            <p className="text-sm text-slate-500">
              {t("pages.reco.historyEmpty") ||
                "Aucune recommandation enregistrée pour le moment."}
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs text-slate-700"
                >
                  <p className="font-semibold text-[11px] text-slate-500 mb-1">
                    {formatDate(item.createdAt)}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

type ProfileCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string;
};

function ProfileCard({ title, icon, value }: ProfileCardProps) {
  const colorSchemes = [
    { bg: 'from-purple-500 to-pink-500', text: 'from-purple-600 to-pink-600', border: 'border-purple-200 hover:border-purple-400' },
    { bg: 'from-blue-500 to-cyan-500', text: 'from-blue-600 to-cyan-600', border: 'border-blue-200 hover:border-blue-400' },
    { bg: 'from-emerald-500 to-teal-500', text: 'from-emerald-600 to-teal-600', border: 'border-emerald-200 hover:border-emerald-400' },
    { bg: 'from-amber-500 to-orange-500', text: 'from-amber-600 to-orange-600', border: 'border-amber-200 hover:border-amber-400' },
  ];
  
  const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  
  return (
    <div className={`group rounded-2xl border-2 ${scheme.border} bg-white shadow-xl hover:shadow-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
          {title}
        </p>
        <span className={`h-12 w-12 rounded-xl bg-gradient-to-br ${scheme.bg} grid place-items-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
          {icon}
        </span>
      </div>
      <p className={`text-3xl font-black bg-gradient-to-r ${scheme.text} bg-clip-text text-transparent mt-1`}>{value}</p>
    </div>
  );
}
