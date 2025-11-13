import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { askBot } from "../services/chatService";
import type { ChatResp } from "../services/chatService";
import {
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";

type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

export default function Chat() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text:
        (t("chat.welcome") as string) ??
        "Hi! I’m your SportConnectIA coach. Ask me anything about training, habits and health 😊",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // autoscroll al final
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [msgs, loading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function sendMessage() {
    if (!canSend) return;
    const q = input.trim();
    setInput("");
    setError(null);

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
    };
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);

    try {
      // 🔗 Llama tu microservicio de chat
      const res: ChatResp = await askBot(q, i18n.language);
      const answerText =
        res?.answer ??
        (t("chat.emptyAnswer") as string) ??
        "…";

      const botMsg: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: answerText,
      };
      setMsgs((m) => [...m, botMsg]);
    } catch (e: any) {
      setError(
        e?.message ||
          e?.detail ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-4 flex items-center gap-2">
        <Bot className="text-accent" />
        <h1 className="text-2xl font-extrabold">
          {t("chat.title") as string}
        </h1>
      </header>

      {/* Tarjeta de chat */}
      <div className="glass rounded-2xl overflow-hidden border border-white/60">
        {/* Lista de mensajes */}
        <div
          ref={listRef}
          className="h-[60vh] overflow-y-auto px-4 py-6 bg-gradient-to-b from-white/70 to-slate-50"
        >
          {msgs.map((m) => (
            <Bubble
              key={m.id}
              role={m.role}
              text={m.text}
            />
          ))}

          {loading && (
            <div className="mt-3 flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("chat.typing") as string}</span>
            </div>
          )}

          {!msgs?.length && (
            <EmptyState
              text={t("chat.empty") as string}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-white/60 bg-white/70 backdrop-blur-xl">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={onKeyDown}
              placeholder={
                (t(
                  "chat.placeholder"
                ) as string) ||
                "Write your question…"
              }
              className="flex-1 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={sendMessage}
              disabled={!canSend}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-sky-600 shadow-md hover:opacity-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {t("chat.send") as string}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Subcomponentes ---------- */

function Bubble({
  role,
  text,
}: {
  role: "user" | "assistant" | "system";
  text: string;
}) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      <div className="flex items-start gap-2 max-w-[80%]">
        {!isUser && (
          <div className="mt-1 grid place-items-center h-8 w-8 rounded-full bg-slate-900 text-white">
            <Bot className="h-4 w-4" />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-sky-600 text-white rounded-br-sm"
              : "bg-white text-ink border border-slate-200 rounded-bl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
        </div>
        {isUser && (
          <div className="mt-1 grid place-items-center h-8 w-8 rounded-full bg-white border border-slate-200">
            <UserIcon className="h-4 w-4 text-slate-700" />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-full grid place-items-center text-center text-slate-500">
      <div>
        <div className="text-6xl">💬</div>
        <p className="mt-2">{text}</p>
      </div>
    </div>
  );
}
