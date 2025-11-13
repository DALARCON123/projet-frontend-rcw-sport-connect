import { Link } from 'react-router-dom'
import { getProfileLocal } from '../services/profileService'

type CardProps = { to: string; title: string; desc: string }

const Card = ({ to, title, desc }: CardProps) => (
  <Link
    to={to}
    className="block rounded-2xl p-5 bg-white/70 border border-white/60 shadow-glass hover:shadow transition"
  >
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-slate-600 text-sm">{desc}</p>
  </Link>
)

export default function Dashboard() {
  const profile = getProfileLocal()
  const name = (localStorage.getItem('user_name') || '').trim()

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Banner/hero con imagen */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white mb-8">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
          alt="Entrenamiento"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="relative p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow">
            {name ? `¡Bienvenida ${name}!` : '¡Bienvenido/a!'}
          </h1>
          <p className="mt-2 text-white/90">
            {profile
              ? 'Con tu perfil configurado, empezamos a personalizar tu plan.'
              : 'Completa tu perfil para obtener recomendaciones más precisas.'}
          </p>
        </div>
      </div>

      {/* Tarjetas de navegación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!profile && (
          <Card
            to="/onboarding"
            title="Completar perfil"
            desc="Edad, peso, talla y objetivos."
          />
        )}
        <Card
          to="/reco"
          title="Recomendaciones"
          desc="Rutinas y planes sugeridos por IA."
        />
        <Card
          to="/chat"
          title="Chat Coach"
          desc="Habla con el asistente de entrenamiento."
        />
        <Card
          to="/sports"
          title="Deportes"
          desc="Explora actividades y eventos."
        />
        <Card
          to="/tracking"
          title="Seguimiento"
          desc="Progreso, medidas y hábitos."
        />
        <Card
          to="/nutrition"
          title="Nutrición"
          desc="Ideas de comidas y macros."
        />
      </div>
    </section>
  )
}
