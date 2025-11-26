import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <section className="max-w-xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {isEdit ? "Mettre à jour mon profil" : "Configurer mon profil"}
        </h1>
        <p className="mt-1 text-slate-600">
          Ces infos nous aident à personnaliser vos recommandations.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white shadow-xl border border-slate-200 px-6 py-8 space-y-6"
      >
        {/* Grid de edad, peso, talla */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Âge
            </label>
            <input
              type="number"
              value={form.age ?? ""}
              onChange={handleNum("age")}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
              placeholder="ex: 30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Poids (kg)
            </label>
            <input
              type="number"
              value={form.weightKg ?? ""}
              onChange={handleNum("weightKg")}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
              placeholder="70"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Taille (cm)
            </label>
            <input
              type="number"
              value={form.heightCm ?? ""}
              onChange={handleNum("heightCm")}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-fuchsia-500"
              placeholder="165"
            />
          </div>
        </div>

        {/* Objectif */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Objectif principal
          </label>

          <select
            value={form.goal || ""}
            onChange={handleText("goal")}
            className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-fuchsia-500"
          >
            <option value="">Choisir…</option>
            <option value="Perte de poids">Perte de poids</option>
            <option value="Remise en forme">Remise en forme</option>
            <option value="Prise de masse">Prise de masse</option>
            <option value="Bien-être général">Bien-être général</option>
          </select>
        </div>

        {/* Nivel */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            Niveau actuel
          </label>

          <div className="flex gap-2">
            {["debutant", "intermediaire", "avance"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, level: lvl as Profile["level"] }))
                }
                className={`px-3 py-2 rounded-full border text-xs transition
                  ${
                    form.level === lvl
                      ? "bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500 text-white border-transparent"
                      : "bg-white border-slate-300 text-slate-700 hover:border-fuchsia-400"
                  }
                `}
              >
                {lvl === "debutant"
                  ? "Débutant"
                  : lvl === "intermediaire"
                  ? "Intermédiaire"
                  : "Avancé"}
              </button>
            ))}
          </div>
        </div>

        {/* Días / Duración */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-semibold mb-1">
              Jours / semaine
            </label>
            <input
              type="number"
              value={form.daysPerWeek ?? ""}
              onChange={handleNum("daysPerWeek")}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Minutes / séance
            </label>
            <input
              type="number"
              value={form.minutesPerSession ?? ""}
              onChange={handleNum("minutesPerSession")}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-white text-sm font-semibold 
              bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500 shadow-md hover:brightness-110"
          >
            {isEdit ? "Enregistrer" : "Créer mon profil"}
          </button>
        </div>
      </form>
    </section>
  );
}
