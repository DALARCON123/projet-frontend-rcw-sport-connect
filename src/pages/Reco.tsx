// src/pages/Reco.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Apple,
  Brain,
  History,
  Loader2,
  Sparkles,
} from "lucide-react";

type Profile = {
  name?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  mainGoal?: string;
  lang?: string;
};

type RecoItem = {
  id: string;
  answer: string;
  createdAt?: { seconds: number; nanoseconds: number } | string;
};

// 🔗 URL del microservicio de recomendaciones
const API_URL =
  import.meta.env.VITE_RECO_API_URL ?? "http://localhost:8003";

export default function RecoPage() {
  const { t, i18n } = useTranslation();

  // ✅ UID: primero el que tengas en localStorage, si no, fallback.
  //    OJO: aquí va la O mayúscula, NO el número 0
  const userId =
    localStorage.getItem("firebase_uid") || "4JHfLr9xOabc9Qp2kD21";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [latestReco, setLatestReco] = useState<string>("");
  const [history, setHistory] = useState<RecoItem[]>([]);
  const [loadingReco, setLoadingReco] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------- Helpers --------

  function formatDate(v?: any) {
    if (!v) return "";
    // Firestore timestamp
    if (typeof v === "object" && v.seconds != null) {
      const d = new Date(v.seconds * 1000);
      return d.toLocaleString();
    }
    // string
    return String(v);
  }

  // -------- Cargar historial al entrar --------
  useEffect(() => {
    if (!userId) return;
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      }
    } catch (e: any) {
      console.error("Erreur loadHistory:", e);
      setError("Impossible de charger l'historique des recommandations.");
    } finally {
      setLoadingHistory(false);
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

      // Recargar historial para mostrar la nueva entrada
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

  // -------- UI --------
  const displayProfile: Profile = profile || {
    // fallback: por si el backend aún no devuelve profile
    name: "SportConnectIA",
    age: 39,
    weightKg: 64,
    heightCm: 160,
    mainGoal: "Perte de poids",
  };

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
              "SportConnectIA analyse ton profil pour te proposer un plan d'entraînement et d'alimentation sain."}
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

        {/* Recomendación actual */}
        <section className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-fuchsia-600" />
              {t("pages.reco.latest") || "Recommandation IA actuelle"}
            </h2>

            {latestReco ? (
              <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {latestReco}
              </p>
            ) : loadingReco ? (
              <p className="text-sm text-slate-500">
                {t("pages.reco.loading") ||
                  "Génération des recommandations..."}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                {t("pages.reco.empty") ||
                  "Clique sur le bouton ci-dessus pour générer tes premières recommandations."}
              </p>
            )}
          </div>

          {/* Panel lateral motivacional / info */}
          <aside className="rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-sky-50 to-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-fuchsia-700 mb-1">
              {t("pages.reco.tipsTitle") || "Conseils du coach"}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              {t("pages.reco.tipsBody") ||
                "Commence progressivement, écoute ton corps et vise la constance plutôt que la perfection. Chaque petite séance compte pour ta santé."}
            </p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>• 10–15 min de marche valent mieux que rien.</li>
              <li>• Hydrate-toi régulièrement.</li>
              <li>• Privilégie les aliments frais et peu transformés.</li>
            </ul>
          </aside>
        </section>

        {/* Historial */}
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
