import { useTranslation } from "react-i18next";

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="px-2 py-1 rounded-lg border"
    >
      <option value="es">ES</option>
      <option value="fr">FR</option>
      <option value="en">EN</option>
      <option value="en">PT</option>

    </select>
  );
}
