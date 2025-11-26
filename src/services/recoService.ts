// src/services/recoService.ts
const RECO_API_URL =
  import.meta.env.VITE_RECO_API_URL ?? "http://localhost:8003";

export type RecoItem = {
  id: string;
  question?: string;
  answer?: string;
  createdAt?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  mainGoal?: string;
  lang?: string;
};

export async function generateReco(userId: string, lang: string) {
  const resp = await fetch(`${RECO_API_URL}/reco/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, lang }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Error ${resp.status} en /reco/generate`);
  }

  return (await resp.json()) as { answer: string; profile: any };
}

export async function fetchRecoHistory(userId: string): Promise<RecoItem[]> {
  const resp = await fetch(`${RECO_API_URL}/reco/history/${userId}`);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Error ${resp.status} en /reco/history`);
  }
  return (await resp.json()) as RecoItem[];
}
