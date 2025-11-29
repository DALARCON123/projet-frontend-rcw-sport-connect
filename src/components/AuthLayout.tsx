import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AuthLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* blobs décoratifs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl" />
      </div>

      {/* contenu principal */}
      <main className="w-full py-40 px-6 pb-16 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        {/* Illustration motivante */}
        <div className="order-2 md:order-1">
          <div className="aspect-[4/3] rounded-3xl bg-white/70 border border-white/60 shadow-xl grid place-items-center">
            <div className="text-slate-600 text-center px-6">
              <div className="text-7xl mb-4">💪🫀</div>
              <p className="font-semibold">{t("auth.hero.title")}</p>
              <p className="text-sm mt-1">{t("auth.hero.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* formulaire */}
        <div className="order-1 md:order-2">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">{title}</h1>
          <div className="glass rounded-2xl p-6 bg-white/80 shadow-md">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
