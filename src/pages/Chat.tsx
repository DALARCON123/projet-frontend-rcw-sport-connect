// src/pages/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { askBot } from "../services/chatService";
import type { ChatResp } from "../services/chatService";
import { Bot, User as UserIcon, Send, MessageSquare, Sparkles, Plus, Trash2, Clock } from "lucide-react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const { t, i18n } = useTranslation();

  const [input, setInput] = useState("");

  // ----- Historial de conversaciones (lista de IDs) -----
  const [history, setHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("chat_history") || "[]") || [];
  });

  // ID de chat activo
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("chat_active") || "default";
  });

  // Mensajes del chat activo
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    const saved = localStorage.getItem("chat_" + activeChatId);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          (t("chat.welcome") as string) ||
          "Bonjour ! Je suis ton coach SportConnectIA 😊",
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // --------- Efectos: guardar en localStorage ---------

  // Guarda mensajes de la conversación activa
  useEffect(() => {
    localStorage.setItem("chat_" + activeChatId, JSON.stringify(msgs));
  }, [msgs, activeChatId]);

  // Guarda lista de historiales
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);

  // Guarda id activo
  useEffect(() => {
    localStorage.setItem("chat_active", activeChatId);
  }, [activeChatId]);

  // Autoscroll al final cuando cambian mensajes / loading
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, loading]);

  // --------- Enviar mensaje (input normal o FAQ) ---------

  async function sendMessage(textOverride?: string) {
    const raw = textOverride ?? input;
    const q = raw.trim();
    if (!q || loading) return;

    if (!textOverride) {
      setInput("");
    }

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
    };
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);

    // Añadir chat al historial si aún no existe
    if (!history.includes(activeChatId)) {
      setHistory((h) => [...h, activeChatId]);
    }

    try {
    const historyForApi = [...msgs, userMsg];

    const res: ChatResp = await askBot(q, i18n.language, historyForApi);

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          res?.answer ||
          (t("chat.emptyAnswer") as string) ||
          "Je n’ai pas compris 🧐",
      };
      setMsgs((m) => [...m, botMsg]);
    } catch (e) {
      console.error("Error en el chatbot:", e);
      const errorMessage = e instanceof Error ? e.message : "Error desconocido";
      setMsgs((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            (t("chat.error") as string) + ` (${errorMessage})` ||
            "Une erreur est survenue. Réessayez dans quelques instants.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleFaqClick(key: string) {
    const q = (t(key) as string) || "";
    if (q.trim()) {
      sendMessage(q);
    }
  }

  function startNewChat() {
    const id = crypto.randomUUID();
    setActiveChatId(id);
    setMsgs([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          (t("chat.welcome") as string) ||
          "Bonjour ! Je suis ton coach SportConnectIA 😊",
      },
    ]);
  }

  function deleteChat(chatId: string) {
    if (!window.confirm(t("chat.confirm_delete") as string || "¿Eliminar esta conversación?")) {
      return;
    }

    // Eliminar del localStorage
    localStorage.removeItem("chat_" + chatId);

    // Actualizar el historial
    const newHistory = history.filter((h) => h !== chatId);
    setHistory(newHistory);

    // Si es el chat activo, cambiar a uno nuevo
    if (chatId === activeChatId) {
      startNewChat();
    }
  }

  const faqKeys = ["chat.faq_1", "chat.faq_2", "chat.faq_3", "chat.faq_4"];

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* -------------------------------------------------
         PANEL IZQUIERDO – HISTORIAL
      --------------------------------------------------- */}
      <aside className="relative z-10 w-96 border-r border-white/60 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto shadow-xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
              <MessageSquare className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Coach IA
              </h2>
              <p className="text-xs text-slate-600">Assistant intelligent</p>
            </div>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="w-full mb-6 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nouveau Chat
        </button>

        <div className="space-y-3">
          {history.length === 0 && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-sm text-slate-500">
                {t("chat.no_conversations") as string}
              </p>
            </div>
          )}

          {history.map((h) => (
            <div key={h} className="group flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChatId(h);
                  const saved = localStorage.getItem("chat_" + h);
                  setMsgs(
                    saved
                      ? JSON.parse(saved)
                      : [
                          {
                            id: crypto.randomUUID(),
                            role: "assistant",
                            text:
                              (t("chat.welcome") as string) ||
                              "Bonjour ! Je suis ton coach SportConnectIA 😊",
                          },
                        ]
                  );
                }}
                className={`flex-1 text-left px-4 py-3 rounded-xl border-2 text-sm transition-all font-medium ${
                  h === activeChatId
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg"
                    : "border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-4 w-4 ${
                    h === activeChatId ? "text-purple-500" : "text-slate-400"
                  }`} />
                  <span>{t("chat.history_title") as string}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Il y a quelques instants</span>
                </div>
              </button>
              <button
                onClick={() => deleteChat(h)}
                className="p-2.5 rounded-xl border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-400 text-red-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-sm"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* -------------------------------------------------
         PANEL DERECHO – CHAT + INPUT + FAQ
      --------------------------------------------------- */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden min-h-0">
        {/* HEADER ESPECTACULAR */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 px-8 py-6 shrink-0 shadow-2xl border-b-2 border-white/30">
          {/* Patrón de fondo */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border-2 border-white/30">
              <Bot className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white drop-shadow-2xl flex items-center gap-3">
                Assistant Coach IA
                <Sparkles className="h-7 w-7 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-lg text-white/95 drop-shadow-lg mt-2">
                {t("chat.subtitle") as string || "Conseils personnalisés • Disponible 24/7 • Intelligence artificielle"}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-transparent to-slate-50/30">
          {/* Mensajes */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-10 py-8 space-y-6 w-full"
          >
            {msgs.map((m) => (
              <Bubble key={m.id} role={m.role} text={m.text} />
            ))}

            {loading && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border-2 border-purple-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: "0s"}}></span>
                      <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                      <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                    </div>
                    <span className="text-sm text-slate-600">{t("chat.typing") as string}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-10 py-5 border-t border-white/60 bg-white/90 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  (t("chat.placeholder") as string) ||
                  "Posez votre question au coach…"
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 rounded-2xl border-2 border-slate-200 focus:border-purple-400 bg-white px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-purple-100 transition-all shadow-sm"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">{t("chat.send") as string}</span>
              </button>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="px-10 py-5 border-t border-white/60 bg-gradient-to-b from-white/90 to-purple-50/30 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {t("chat.faq_title") as string}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {faqKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFaqClick(key)}
                  className="group flex items-start gap-3 w-full rounded-2xl border-2 border-slate-200 hover:border-purple-400 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 px-4 py-3 text-left text-sm text-slate-700 hover:text-purple-700 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                    <Sparkles className="h-4 w-4 text-purple-500 group-hover:text-white" />
                  </div>
                  <span className="font-medium pt-0.5">{t(key) as string}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------
   Burbuja de mensaje
--------------------------------------------------- */
function Bubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      {!isUser && (
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      <div
        className={`group relative max-w-2xl px-5 py-4 rounded-2xl shadow-lg text-sm whitespace-pre-wrap leading-relaxed transition-all hover:shadow-xl ${
          isUser
            ? "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white rounded-br-sm"
            : "bg-white text-slate-800 border-2 border-purple-100 rounded-bl-sm hover:border-purple-200"
        }`}
      >
        {!isUser && (
          <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        )}
        {text}
      </div>

      {isUser && (
        <div className="h-10 w-10 rounded-full bg-white border-2 border-purple-200 flex items-center justify-center shadow-lg shrink-0">
          <UserIcon className="h-5 w-5 text-purple-600" />
        </div>
      )}
    </div>
  );
}
