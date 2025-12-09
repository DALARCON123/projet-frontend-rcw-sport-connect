// src/services/chatService.ts
import { chatClient } from "./apiClient";

export type ChatResp = {
  answer?: string;
};

// message = texto del usuario
// lang = 'es' | 'fr' | 'en' ...
// history = histórico do chat (lista de mensagens)
// profile = datos opcionales (edad, peso, etc.)
export async function askBot(
  message: string,
  lang: string = "fr",
  history: { role: string; text: string }[] = [],
  profile?: any
): Promise<ChatResp> {
  // OJO: aquí solo "/ask" porque la base ya es "/chat"
  const resp = await chatClient.post<ChatResp>("/ask", {
    message,
    lang,
    history,  // 👈 NOVO
    profile,
  });

  return resp; // devolvemos el objeto { answer: ... }
}
