//LangSwitcher.tsx
import { useTranslation } from "react-i18next";

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="px-2 py-1 rounded-lg border"
    >
      {/* FR: Sélecteur de langue simple */}
      <option value="es">ES</option>
      <option value="fr">FR</option>
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </select>
  );
}
