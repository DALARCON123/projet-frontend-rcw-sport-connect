import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 mt-10 bg-white/70">
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs md:text-sm text-slate-500 text-center">
        {t("footer.text")}
      </div>
    </footer>
  );
}
