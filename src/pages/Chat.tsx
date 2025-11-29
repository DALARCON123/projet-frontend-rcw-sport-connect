// src/pages/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { askBot } from "../services/chatService";
import type { ChatResp } from "../services/chatService";
import { Bot, User as UserIcon, Send, MessageSquare } from "lucide-react";

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
      const res: ChatResp = await askBot(q, i18n.language);

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
    <div className="w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50">
      {/* -------------------------------------------------
         PANEL IZQUIERDO – HISTORIAL
      --------------------------------------------------- */}
      <aside className="w-96 border-r bg-white/90 backdrop-blur-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <MessageSquare className="text-fuchsia-600" />
          Assistant Coach IA
        </h2>

        <button
          onClick={startNewChat}
          className="w-full mb-4 bg-gradient-to-r from-fuchsia-600 to-sky-600 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition"
        >
          + Nouveau chat
        </button>

        <div className="space-y-2">
          {history.length === 0 && (
            <p className="text-xs text-slate-500">
              {t("chat.no_conversations") as string}
            </p>
          )}

          {history.map((h) => (
            <div key={h} className="flex items-center gap-2">
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
                className={`flex-1 text-left px-3 py-2 rounded-lg border text-sm transition ${
                  h === activeChatId
                    ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                💬 {t("chat.history_title") as string}
              </button>
              <button
                onClick={() => deleteChat(h)}
                className="px-2 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 text-sm transition"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* -------------------------------------------------
         PANEL DERECHO – CHAT + INPUT + FAQ
      --------------------------------------------------- */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="px-8 py-4 border-b bg-white/80 backdrop-blur-xl shrink-0">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Bot className="text-fuchsia-600" />
            Assistant Coach IA
          </h1>
          <p className="text-slate-600 text-sm">
            {t("chat.subtitle") as string}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mensajes */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-10 py-6 space-y-4 w-full"
          >
            {msgs.map((m) => (
              <Bubble key={m.id} role={m.role} text={m.text} />
            ))}

            {loading && (
              <p className="text-slate-500 text-sm">
                ⏳ {t("chat.typing") as string}
              </p>
            )}
          </div>

          {/* Input */}
          <div className="px-10 py-3 border-t bg-white/80 backdrop-blur-xl shrink-0">
            <div className="flex gap-2">
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
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-sky-600 shadow hover:opacity-95 disabled:opacity-50 transition"
              >
                <Send className="h-4 w-4" />
                {t("chat.send") as string}
              </button>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="px-10 py-4 border-t bg-white/80 shrink-0">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              {t("chat.faq_title") as string}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {faqKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFaqClick(key)}
                  className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-slate-100 hover:border-sky-300 transition"
                >
                  <span className="text-fuchsia-500 text-sm">💡</span>
                  <span>{t(key) as string}</span>
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
    <div className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center mr-2">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
        }`}
      >
        {text}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-white border border-slate-200 grid place-items-center ml-2">
          <UserIcon className="h-4 w-4 text-slate-700" />
        </div>
      )}
    </div>
  );
}
