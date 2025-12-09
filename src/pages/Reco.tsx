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
  Mail,
  TrendingDown,
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

const isDev = import.meta.env.DEV;
// em dev usamos o proxy do Vite (API_URL = ""), em prod usamos variável de env
const API_URL = isDev
  ? ""
  : import.meta.env.VITE_RECO_URL ?? "http://localhost:8003";

function parseRecoToSections(text: string): ParsedSection[] {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    if (line.startsWith("**") && line.includes("**", 2)) {
      const cleanTitle = line.replace(/\*\*/g, "").replace(/:+$/, "").trim();
      if (current) sections.push(current);
      current = { title: cleanTitle || "Plan", bullets: [] };
    } else if (line.startsWith("*")) {
      const bullet = line
        .replace(/^\*+/, "")
        .trim()
        .replace(/^\*/, "")
        .trim();
      if (!current) current = { title: "Plan", bullets: [] };
      if (bullet) current.bullets.push(bullet);
    } else {
      if (!current) current = { title: "Plan", bullets: [] };
      current.bullets.push(line);
    }
  }

  if (current) sections.push(current);
  return sections;
}

export default function RecoPage() {
  const { t, i18n } = useTranslation();

  const getUserId = (): string => {
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
        return payload.sub || payload.email || payload.user_id || "";
      } catch {
        // ignore
      }
    }
    return localStorage.getItem("technologyana@gmail.com") || "";
  };

  const userId = getUserId();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestReco, setLatestReco] = useState<string>("");
  const [history, setHistory] = useState<RecoItem[]>([]);
  const [loadingReco, setLoadingReco] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [savingMeasurement, setSavingMeasurement] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const [sendingReport, setSendingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [measureDate, setMeasureDate] = useState(today);
  const [measureWeight, setMeasureWeight] = useState("");
  const [measureWaist, setMeasureWaist] = useState("");
  const [measureHips, setMeasureHips] = useState("");
  const [measureChest, setMeasureChest] = useState("");
  const [measureNotes, setMeasureNotes] = useState("");

  const trackingKey = (profile?.email || userId).toLowerCase();

  function formatDate(v?: any) {
    if (!v) return "";
    if (typeof v === "object" && (v as any).seconds != null) {
      const d = new Date((v as any).seconds * 1000);
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

  useEffect(() => {
    if (!userId) return;
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
        answer: d.answer ?? d.content ?? "",
        createdAt: d.createdAt ?? d.created_at,
      }));

      setHistory(mapped.slice(0, 8));

      if (mapped.length > 0) {
        setLatestReco(mapped[0].answer || "");

        const meta = (data[0].metadata || {}) as any;
        setProfile((prev) => ({
          ...(prev || {}),
          age: meta.age ?? prev?.age,
          weightKg: meta.weight_kg ?? prev?.weightKg,
          heightCm: meta.height_cm ?? prev?.heightCm,
          mainGoal: meta.main_goal ?? prev?.mainGoal,
          lang: meta.lang ?? prev?.lang,
          email: data[0].email ?? prev?.email,
        }));
      }
    } catch (e: any) {
      console.error("Erreur loadHistory:", e);
      setError(
        t("pages.reco.errors.history") ||
          "Impossible de charger l'historique des recommandations."
      );
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadMeasurements(email: string) {
    try {
      setLoadingMeasurements(true);
      setTrackingError(null);

      const resp = await fetch(
        `${API_URL}/tracking/measurements?email=${encodeURIComponent(email)}`
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
        t("pages.reco.errors.trackingLoad") ||
          "Impossible de charger les mesures de suivi. Réessaie plus tard."
      );
    } finally {
      setLoadingMeasurements(false);
    }
  }

async function handleGenerate() {
  if (!userId) {
    setError(
      t("pages.reco.errors.noUser") ||
        "Utilisateur introuvable (uid manquant)."
    );
    return;
  }

  // Tenta carregar o profile_v1, mas não bloqueia se não existir
  const localProfile = localStorage.getItem("profile_v1");
  let profileData: any = {};

  if (localProfile) {
    try {
      profileData = JSON.parse(localProfile);
    } catch (e) {
      console.error("Erreur JSON profile_v1:", e);
      profileData = {};
    }
  }

  try {
    setLoadingReco(true);
    setError(null);

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

    const resp = await fetch(`${API_URL}/reco/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Error HTTP " + resp.status);
    }

    const data = await resp.json();
    const answer: string = data.answer || data.content || "";
    setLatestReco(answer);

    setProfile({
      name: localStorage.getItem("user_name") || undefined,
      email: localStorage.getItem("user_email") || undefined,
      age: requestBody.age,
      weightKg: requestBody.weight_kg,
      heightCm: requestBody.height_cm,
      mainGoal: requestBody.main_goal,
      lang: i18n.language,
    });

    await loadHistory();
  } catch (e: any) {
    console.error("Erreur handleGenerate:", e);
    setError(
      t("pages.reco.errors.generate", { message: e.message }) ||
        "Une erreur est survenue lors de la génération des recommandations. Détails: " +
          e.message
    );
  } finally {
    setLoadingReco(false);
  }
}

  async function handleSendReport() {
    setReportStatus(null);

    if (!userId) {
      setReportStatus(
        t("pages.reco.report.noUser") ||
          "Utilisateur introuvable (uid manquant)."
      );
      return;
    }

    const email =
      profile?.email || localStorage.getItem("tecnologyana@gmail.com") || "";

    if (!email) {
      setReportStatus(
        t("pages.reco.report.noEmail") ||
          "Aucun email trouvé pour cet utilisateur."
      );
      return;
    }

    try {
      setSendingReport(true);

      const name =
        profile?.name || localStorage.getItem("user_name") || "";

      const resp = await fetch(`${API_URL}/reco/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          email,
          name,
          lang: i18n.language,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erreur HTTP " + resp.status);
      }

      const data = await resp.json();
      console.log("✅ Rapport envoyé:", data);
      setReportStatus(
        t("pages.reco.report.success") ||
          "Rapport envoyé avec succès à ton adresse e-mail."
      );
    } catch (e: any) {
      console.error("Erreur handleSendReport:", e);
      setReportStatus(
        t("pages.reco.report.error", { message: e.message }) ||
          "Une erreur est survenue lors de l'envoi du rapport : " + e.message
      );
    } finally {
      setSendingReport(false);
    }
  }

  async function handleSaveMeasurement(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingKey) {
      setTrackingError(
        t("pages.reco.errors.missingTrackingUser") ||
          "Utilisateur introuvable pour le suivi."
      );
      return;
    }
    if (!measureDate) {
      setTrackingError(t("pages.reco.errors.missingDate") || "La date est obligatoire.");
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

      setMeasureWeight("");
      setMeasureWaist("");
      setMeasureHips("");
      setMeasureChest("");
      setMeasureNotes("");

      await loadMeasurements(trackingKey);
    } catch (e: any) {
      console.error("Erreur handleSaveMeasurement:", e);
      setTrackingError(
        t("pages.reco.errors.trackingSave") ||
          "Erreur lors de l’enregistrement de la mesure. Vérifie les valeurs."
      );
    } finally {
      setSavingMeasurement(false);
    }
  }

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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-slate-50 to-sky-50 px-4 sm:px-8 py-8">
      <header className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-fuchsia-600 h-7 w-7" />
            {t("pages.reco.title") || "Recommandations personnalisées"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t("pages.reco.subtitle") ||
              "SportConnectIA analyse ton profil pour te proposer un plan d'entraînement, d'alimentation et de récupération sain."}
          </p>
          {reportStatus && (
            <p className="text-xs mt-2 text-slate-500">{reportStatus}</p>
          )}
          {error && (
            <p className="text-xs mt-1 text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <button
            onClick={handleGenerate}
            disabled={loadingReco}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 transition"
          >
            {loadingReco ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            {t("pages.reco.generate") || "Générer mes recommandations IA"}
          </button>

          <button
            onClick={handleSendReport}
            disabled={sendingReport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60 transition"
          >
            {sendingReport ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {t("pages.reco.sendReport") || "Envoyer un résumé"}
          </button>
        </div>
      </header>

      {/* 1) Résumé du profil + recommandation actuelle */}
      <main className="max-w-5xl mx-auto space-y-8">
        {/* Cards de profil */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {t("pages.reco.age")}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 flex items-center gap-1">
                <Activity className="h-4 w-4 text-fuchsia-500" />
                {t("pages.reco.profileCard.ageUnit", {
                  value: displayProfile.age ?? "—",
                }) ||
                  `${displayProfile.age ?? "—"} ans`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {t("pages.reco.weight")}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900 flex items-center gap-1">
                <Apple className="h-4 w-4 text-emerald-500" />
                {t("pages.reco.profileCard.weightUnit", {
                  value: displayProfile.weightKg ?? "—",
                }) ||
                  `${displayProfile.weightKg ?? "—"} kg`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {t("pages.reco.height")}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {t("pages.reco.profileCard.heightUnit", {
                  value: displayProfile.heightCm ?? "—",
                }) ||
                  `${displayProfile.heightCm ?? "—"} cm`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-slate-100 shadow-sm px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {t("pages.reco.mainGoal")}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {displayProfile.mainGoal ?? "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Recommandation IA actuelle */}
        <section className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm px-5 py-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                {t("pages.reco.latest") || "Recommandation IA actuelle"}
              </h2>
            </div>
          </div>

          {loadingHistory && !latestReco && (
            <p className="text-sm text-slate-500">
              {t("pages.reco.current.loading") ||
                "Chargement de tes recommandations…"}
            </p>
          )}

          {!loadingHistory && sections.length === 0 && (
            <p className="text-sm text-slate-500">
              {t("pages.reco.current.empty", {
                action: t("pages.reco.generate"),
              }) ||
                'Aucune recommandation pour le moment. Clique sur “Générer mes recommandations IA” pour commencer.'}
            </p>
          )}

          {sections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {sections.map((sec, idx) => (
                  <article
                    key={idx}
                    className={`rounded-2xl bg-gradient-to-br ${
                      sectionGradients[idx % sectionGradients.length]
                    } border border-white/60 shadow-sm p-4
                    transform transition-transform duration-200 hover:scale-[1.01] md:hover:scale-[1.02] hover:shadow-md`}
                  >
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-fuchsia-500" />
                    {sec.title}
                  </h3>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}

          <p className="mt-4 text-[11px] text-slate-400">
            {t("pages.reco.disclaimer") ||
              "Ces recommandations sont indicatives et ne remplacent pas l'avis d'un professionnel de santé. Adapte toujours l'intensité à ton niveau et à ton ressenti."}
          </p>
        </section>

        {/* 2) Suivi de ton évolution + graphique */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de mesures */}
          <div className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-sky-500" />
              {t("pages.reco.tracking.title") || "Suivi de ton évolution"}
            </h2>
            {trackingError && (
              <p className="text-xs text-red-500 mb-2">{trackingError}</p>
            )}
            {loadingMeasurements && (
              <p className="text-xs text-slate-500 mb-2">
                {t("pages.reco.tracking.loading") || "Chargement de tes mesures…"}
              </p>
            )}

            <form
              onSubmit={handleSaveMeasurement}
              className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700"
            >
              <div className="flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.date") || "Date"}
                </label>
                <input
                  type="date"
                  value={measureDate}
                  onChange={(e) => setMeasureDate(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.weight") || "Poids (kg)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measureWeight}
                  onChange={(e) => setMeasureWeight(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                  placeholder={
                    t("pages.reco.tracking.form.weightPlaceholder") || "Ex: 65.4"
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.waist") || "Tour de taille (cm)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measureWaist}
                  onChange={(e) => setMeasureWaist(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                  placeholder={
                    t("pages.reco.tracking.form.waistPlaceholder") || "Ex: 72"
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.hips") || "Tour de hanches (cm)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measureHips}
                  onChange={(e) => setMeasureHips(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                  placeholder={
                    t("pages.reco.tracking.form.hipsPlaceholder") || "Ex: 95"
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.chest") ||
                    "Tour de poitrine (cm)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={measureChest}
                  onChange={(e) => setMeasureChest(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                  placeholder={
                    t("pages.reco.tracking.form.chestPlaceholder") || "Ex: 88"
                  }
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="font-medium">
                  {t("pages.reco.tracking.form.notes") || "Notes"}
                </label>
                <textarea
                  value={measureNotes}
                  onChange={(e) => setMeasureNotes(e.target.value)}
                  rows={2}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                  placeholder={
                    t("pages.reco.tracking.form.notesPlaceholder") ||
                    "Ex: Exercices difficiles, peu d'énergie"
                  }
                />
              </div>

              <div className="sm:col-span-2 flex justify-end mt-1">
                <button
                  type="submit"
                  disabled={savingMeasurement}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-sky-700 disabled:opacity-60"
                >
                  {savingMeasurement && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {t("pages.reco.tracking.form.submit") || "Enregistrer la mesure"}
                </button>
              </div>
            </form>

            {latestMeasure && (
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600 flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">
                    {t("pages.reco.tracking.lastMeasure", {
                      date: latestMeasure.date,
                    }) || `Dernière mesure : ${latestMeasure.date}`}
                  </p>
                  <p>
                    {t("pages.reco.tracking.weightLabel") || "Poids :"}{" "}
                    <span className="font-semibold">
                      {t("pages.reco.profileCard.weightUnit", {
                        value: latestMeasure.weight_kg ?? "—",
                      }) ||
                        `${latestMeasure.weight_kg ?? "—"} kg`}
                    </span>
                  </p>
                </div>
                {deltaWeight != null && (
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <TrendingDown className="h-4 w-4" />
                    {t("pages.reco.tracking.delta", {
                      value: deltaWeight.toFixed(1),
                    }) || `${deltaWeight.toFixed(1)} kg`}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Graphique */}
          <div className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-emerald-500" />
              {t("pages.reco.tracking.chartTitle") || "Graphique d'évolution"}
            </h2>
            <p className="text-[11px] text-slate-500 mb-2">
              {t("pages.reco.tracking.description") ||
                "Visualise ton poids et tes mesures dans le temps. Ajoute une première mesure depuis le formulaire à gauche."}
            </p>

            {chartData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-slate-400">
                {t("pages.reco.tracking.empty") ||
                  "Aucune mesure enregistrée pour le moment."}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight_kg"
                      name={t("pages.reco.tracking.chartWeight") || "Poids (kg)"}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* 3) Historique des recommandations */}
        <section className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              {t("pages.reco.historyTitle") || "Historique de tes recommandations"}
            </h2>
          </div>

          {loadingHistory && history.length === 0 && (
            <p className="text-xs text-slate-500">
              {t("pages.reco.loadingHistory") || "Chargement de l'historique…"}
            </p>
          )}

          {!loadingHistory && history.length === 0 && (
            <p className="text-xs text-slate-500">
              {t("pages.reco.historyEmpty") ||
                "Aucune recommandation enregistrée pour le moment."}
            </p>
          )}

          {history.length > 0 && (
            <ul className="space-y-3 text-xs text-slate-700">
              {history.map((item) => {
                const isExpanded = expandedId === item.id;

                return (
                  <li
                    key={item.id}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 cursor-pointer hover:border-sky-200 transition"
                  >
                    <p className="text-[11px] text-slate-500 mb-1">
                      {formatDate(item.createdAt)}
                    </p>

                    <p className={isExpanded ? "" : "line-clamp-3"}>
                      {item.answer ||
                        t("pages.reco.history.emptyItem") ||
                        "(contenu vide)"}
                    </p>

                    <p className="mt-1 text-[11px] text-sky-600 font-medium">
                      {isExpanded
                        ? t("pages.reco.history.showLess") || "Voir moins"
                        : t("pages.reco.history.showMore") || "Voir plus"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}


        </section>
      </main>
    </div>
  );
}
