// src/pages/Tracking.tsx
import { useEffect, useState } from "react";
import { getMeasurements, addMeasurement } from "../services/trackingService";
import type { Measurement } from "../services/trackingService";
import { useTranslation } from "react-i18next";

export default function Tracking() {
  const { t } = useTranslation();
  const email = (localStorage.getItem("user_email") || "").toLowerCase();
  const [rows, setRows] = useState<Measurement[]>([]);
  const [weight, setWeight] = useState<string>("");

  useEffect(() => {
    if (!email) return;
    getMeasurements(email).then(setRows).catch(console.error);
  }, [email]);

  async function save() {
    if (!email || !weight) return;
    const today = new Date().toISOString().slice(0, 10);
    await addMeasurement(email, { date: today, weight_kg: Number(weight) });
    setWeight("");
    const fresh = await getMeasurements(email);
    setRows(fresh);
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* FR: Titre de la page de suivi */}
      <h1 className="text-2xl font-bold mb-4">
        {t("pages.tracking.title", "Seguimiento")}
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          className="rounded-xl border px-3 py-2"
          placeholder={t("pages.tracking.weight_placeholder", "Peso (kg)")}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-xl bg-slate-900 text-white"
          onClick={save}
        >
          {t("pages.tracking.save_button", "Guardar")}
        </button>
      </div>

      <div className="overflow-auto rounded-2xl border border-white/60 bg-white/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">
                {t("pages.tracking.table.date", "Fecha")}
              </th>
              <th className="px-3 py-2 text-left">
                {t("pages.tracking.table.weight", "Peso (kg)")}
              </th>
              <th className="px-3 py-2 text-left">
                {t("pages.tracking.table.waist", "Cintura (cm)")}
              </th>
              <th className="px-3 py-2 text-left">
                {t("pages.tracking.table.notes", "Notas")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{r.date}</td>
                <td className="px-3 py-2">{r.weight_kg ?? "-"}</td>
                <td className="px-3 py-2">{r.waist_cm ?? "-"}</td>
                <td className="px-3 py-2">{r.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
