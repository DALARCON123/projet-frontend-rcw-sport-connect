import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl" />
      </div>

      {/* header solo para login/register */}
      <header className="w-full px-6 py-4 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-fuchsia-600" />
          <span className="font-extrabold tracking-tight text-slate-800">
            SportConnectIA
          </span>
        </Link>
      </header>

      {/* contenido centrado pero sin max-w global */}
      <main className="w-full px-6 pb-16 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        {/* Ilustración simple */}
        <div className="order-2 md:order-1">
          <div className="aspect-[4/3] rounded-3xl bg-white/70 border border-white/60 shadow-xl grid place-items-center">
            <div className="text-slate-600 text-center px-6">
              <div className="text-7xl mb-4">💪🫀</div>
              <p className="font-semibold">Entrena con IA, a tu ritmo</p>
              <p className="text-sm mt-1">
                Programas, retos y seguimiento inteligente
              </p>
            </div>
          </div>
        </div>

        {/* formulario */}
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
