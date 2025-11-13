// src/pages/Onboarding.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfileLocal, saveProfileLocal, upsertProfile, userNameFromToken } from '../services/profileService'
import type { ProfileDto } from '../services/profileService'

export default function Onboarding() {
  const nav = useNavigate()
  const [form, setForm] = useState<ProfileDto>({
    age: 25,
    height_cm: 165,
    weight_kg: 60,
    gender: 'female',
    activity: 'medium',
    goal: 'stay_fit',
  })
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Si ya tiene perfil, va directo al dashboard
  useEffect(() => {
    const has = getProfileLocal()
    if (has) nav('/dashboard')
  }, [nav])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      setLoading(true)
      // opcional: enviar al microservicio de recomendaciones
      await upsertProfile(form)
      // persistimos local
      saveProfileLocal(form)
      // opcional: guardar nombre del token para saludo
      userNameFromToken()
      nav('/dashboard')
    } catch (err: any) {
      setMsg(String(err?.message || err?.detail || 'Error al guardar el perfil'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Completa tu perfil</h1>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Edad" type="number" value={String(form.age)} onChange={v => setForm({ ...form, age: Number(v) })} />
        <Field label="Altura (cm)" type="number" value={String(form.height_cm)} onChange={v => setForm({ ...form, height_cm: Number(v) })} />
        <Field label="Peso (kg)" type="number" value={String(form.weight_kg)} onChange={v => setForm({ ...form, weight_kg: Number(v) })} />

        <label className="block">
          <span className="text-sm text-slate-600">Género</span>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2"
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value as ProfileDto['gender'] })}
          >
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-600">Actividad</span>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2"
            value={form.activity}
            onChange={e => setForm({ ...form, activity: e.target.value as ProfileDto['activity'] })}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </label>

        <label className="sm:col-span-2 block">
          <span className="text-sm text-slate-600">Objetivo</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2"
            value={form.goal}
            onChange={e => setForm({ ...form, goal: e.target.value })}
            placeholder="Perder grasa, ganar masa, mantenerse en forma…"
          />
        </label>

        {msg && <p className="sm:col-span-2 text-sm text-red-600">{msg}</p>}

        <div className="sm:col-span-2">
          <button
            disabled={loading}
            className="w-full rounded-xl px-6 py-3 font-semibold text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-60"
            type="submit"
          >
            {loading ? 'Guardando…' : 'Guardar y continuar'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  )
}
