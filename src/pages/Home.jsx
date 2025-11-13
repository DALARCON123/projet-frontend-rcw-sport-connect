import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { HeartPulse, Dumbbell, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden">
      {/* Fondo decorativo con blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-[24rem] w-[24rem] rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid md:grid-cols-2 items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-soft">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/reco" className="px-5 py-3 rounded-2xl text-white bg-ink hover:opacity-90 transition shadow-lg">
              {t('hero.cta_primary')}
            </Link>
            <Link to="/sports" className="px-5 py-3 rounded-2xl bg-white/80 hover:bg-white text-ink transition shadow">
              {t('hero.cta_secondary')}
            </Link>
          </div>

          {/* Etiquetas inclusivas */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="glass px-3 py-1 rounded-full text-sm">♀️ {t('hero.badge_women')}</span>
            <span className="glass px-3 py-1 rounded-full text-sm">♂️ {t('hero.badge_men')}</span>
            <span className="glass px-3 py-1 rounded-full text-sm">🌈 {t('hero.badge_all')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-6 md:p-8"
        >
          <div className="grid grid-cols-3 gap-4">
            <Feature icon={<HeartPulse />} title={t('hero.card_1')} />
            <Feature icon={<Dumbbell />} title={t('hero.card_2')} />
            <Feature icon={<Sparkles />} title={t('hero.card_3')} />
          </div>
          <p className="mt-6 text-soft text-sm">{t('hero.disclaimer')}</p>
        </motion.div>
      </div>
    </section>
  )
}

function Feature({ icon, title }: {icon: React.ReactNode; title: string}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/80 p-5 text-center shadow-md">
      <div className="h-10 w-10 text-primary">{icon}</div>
      <p className="mt-2 text-sm font-semibold">{title}</p>
    </div>
  )
}
