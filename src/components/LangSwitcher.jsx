import { useTranslation } from 'react-i18next'

export default function LangSwitcher() {
  const { i18n } = useTranslation()
  return (
    <select
      aria-label="Language"
      defaultValue={i18n.language}
      onChange={(e)=>i18n.changeLanguage(e.target.value)}
      className="bg-white/70 border border-white/60 rounded-xl px-3 py-1 text-sm hover:bg-white focus:outline-none"
    >
      <option value="fr">FR</option>
      <option value="es">ES</option>
      <option value="pt">PT</option>
    </select>
  )
}
