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
const API_URL =
  import.meta.env.VITE_RECO_API_URL ?? "http://localhost:8003";

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

  // UID: primero el que tengas en localStorage, si no, fallback.
  const userId =
    localStorage.getItem("firebase_uid") || "4JHfLr9xOabc9Qp2kD21";

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

    try {
      setLoadingReco(true);
      setError(null);

      const resp = await fetch(`${API_URL}/reco/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lang: i18n.language,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Error HTTP " + resp.status);
      }

      const data = await resp.json();

      const answer: string = data.answer || "";
      setLatestReco(answer);
      setProfile(data.profile || null);

      await loadHistory();
    } catch (e: any) {
      console.error("Erreur handleGenerate:", e);
      setError(
        "Une erreur est survenue lors de la génération des recommandations."
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-slate-50 to-sky-50 px-8 py-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-fuchsia-600 h-7 w-7" />
            {t("pages.reco.title") || "Recommandations personnalisées"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t("pages.reco.subtitle") ||
              "SportConnectIA analyse ton profil pour te proposer un plan d'entraînement, d'alimentation et de récupération sain."}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loadingReco}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 transition"
        >
          {loadingReco ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {t("pages.reco.generate") || "Générer mes recommandations IA"}
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        {/* Perfil + métricas */}
        <section className="grid md:grid-cols-4 gap-4">
          <ProfileCard
            title={t("pages.reco.age") || "Âge"}
            icon={<Activity className="h-4 w-4 text-fuchsia-600" />}
            value={
              displayProfile.age != null ? `${displayProfile.age} ans` : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.weight") || "Poids"}
            icon={<Activity className="h-4 w-4 text-sky-600" />}
            value={
              displayProfile.weightKg != null
                ? `${displayProfile.weightKg} kg`
                : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.height") || "Taille"}
            icon={<Activity className="h-4 w-4 text-emerald-600" />}
            value={
              displayProfile.heightCm != null
                ? `${displayProfile.heightCm} cm`
                : "—"
            }
          />
          <ProfileCard
            title={t("pages.reco.mainGoal") || "Objectif principal"}
            icon={<Apple className="h-4 w-4 text-amber-500" />}
            value={displayProfile.mainGoal || "—"}
          />
        </section>

        {/* Recomendación actual en tarjetas */}
        <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4 text-fuchsia-600" />
            {t("pages.reco.latest") || "Recommandation IA actuelle"}
          </h2>

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
              <div className="grid md:grid-cols-3 gap-4 items-stretch">
                {sections.map((sec, idx) => {
                  const gradient =
                    sectionGradients[idx % sectionGradients.length];
                  const isLast = idx === sections.length - 1;

                  return (
                    <div
                      key={`${sec.title}-${idx}`}
                      className={`relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br ${gradient} px-4 py-3 text-xs text-slate-800 shadow-md backdrop-blur-sm flex flex-col ${
                        isLast ? "md:col-span-3" : ""
                      }`}
                    >
                      <span className="absolute left-0 top-4 h-8 w-[3px] rounded-r-full bg-gradient-to-b from-fuchsia-500 to-sky-500" />

                      <div className="pl-2">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/70 shadow-sm">
                            <Sparkles className="h-3 w-3 text-fuchsia-500" />
                          </span>
                          {sec.title || "Plan"}
                        </h3>

                        <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed flex-1">
                          {sec.bullets.map((b, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-[5px] h-[5px] w-[5px] rounded-full bg-fuchsia-400/80 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-fuchsia-400" />
                          Coach IA • SportConnectIA
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
        <section className="grid md:grid-cols-2 gap-5 items-start">
          {/* Formulario de seguimiento */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-600" />
              Suivi de ton évolution
            </h2>

            {trackingError && (
              <p className="text-xs text-red-500 mb-2">{trackingError}</p>
            )}

            <form
              onSubmit={handleSaveMeasurement}
              className="space-y-3 text-xs text-slate-700"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[11px]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={measureDate}
                    onChange={(e) => setMeasureDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[11px]">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureWeight}
                    onChange={(e) => setMeasureWeight(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Ex: 64.5"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[11px]">
                    Tour de taille (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureWaist}
                    onChange={(e) => setMeasureWaist(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Ex: 80"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[11px]">
                    Tour de hanches (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureHips}
                    onChange={(e) => setMeasureHips(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Ex: 95"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-[11px]">
                    Tour de poitrine (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureChest}
                    onChange={(e) => setMeasureChest(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400"
                    placeholder="Ex: 90"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[11px]">
                  Notes (comment tu te sens, séance, etc.)
                </label>
                <textarea
                  value={measureNotes}
                  onChange={(e) => setMeasureNotes(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 min-h-[60px]"
                  placeholder="Ex: Séance facile, bonne énergie…"
                />
              </div>

              <button
                type="submit"
                disabled={savingMeasurement}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-fuchsia-600 px-4 py-2 text-[11px] font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 transition"
              >
                {savingMeasurement ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
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
          <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-600" />
                Graphique d’évolution
              </h2>
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
        <section className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <History className="h-4 w-4 text-sky-600" />
              {t("pages.reco.historyTitle") ||
                "Historique de tes recommandations"}
            </h2>
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
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <span className="h-7 w-7 rounded-full bg-slate-50 border border-slate-100 grid place-items-center">
          {icon}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
