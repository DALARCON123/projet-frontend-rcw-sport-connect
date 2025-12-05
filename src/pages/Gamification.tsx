// src/pages/Gamification.tsx
import { useEffect, useState } from "react";
import { Star, Award, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export default function Gamification() {
  const [medals, setMedals] = useState(0);

  // A cada vez que a pessoa entra nesta página, ganha uma “medalha”
  useEffect(() => {
    const saved = localStorage.getItem("gamification_medals");
    const current = saved ? parseInt(saved, 10) || 0 : 0;
    const next = current + 1;
    setMedals(next);
    localStorage.setItem("gamification_medals", String(next));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-yellow-200 via-amber-300 to-orange-300 flex items-center justify-center shadow-md">
          <Star className="h-7 w-7 text-yellow-700" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Gamification
          </h1>
          <p className="text-sm text-slate-600">
            Chaque visite ici signifie que tu t&apos;entraînes 💪. 
            Tu gagnes une médaille à chaque fois que tu viens sur cette page.
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Carte des médailles */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 px-5 py-6 flex flex-col items-center text-center">
          <Award className="h-10 w-10 text-amber-500 mb-2" />
          <p className="text-sm text-slate-600 mb-1">
            Médailles accumulées
          </p>
          <p className="text-4xl font-extrabold text-slate-900 mb-1">
            {medals}
          </p>
          <p className="text-xs text-slate-500 max-w-xs">
            Reviens t&apos;entraîner régulièrement pour faire monter ton nombre
            de médailles.
          </p>
        </div>

        {/* Carte motivation / liens */}
        <div className="rounded-2xl bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-sky-50 border border-slate-200 px-5 py-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                Continue ta progression
              </h2>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Utilise les recommandations IA et le suivi d&apos;évolution pour 
              transformer ces médailles en vrais progrès sur ton corps et ta santé.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="inline-flex justify-center rounded-full px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition shadow-sm"
            >
              Retour au tableau de bord
            </Link>
            <Link
              to="/reco"
              className="inline-flex justify-center rounded-full px-4 py-2 text-xs font-semibold text-fuchsia-700 bg-white border border-fuchsia-200 hover:bg-fuchsia-50 transition"
            >
              Voir mes recommandations IA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
