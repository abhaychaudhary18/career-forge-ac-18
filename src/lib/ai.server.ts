/**
 * AIService — single abstraction over the model provider.
 * Swap the model/provider here and every feature follows.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3.8-flash";

export class AIError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function friendly(status: number, body: string) {
  if (status === 402) return "AI credits are exhausted for this workspace. Add credits to continue.";
  if (status === 429) return "The AI service is rate limited right now. Try again in a moment.";
  if (status === 401 || status === 403) return "The AI service rejected this request. Check the workspace AI configuration.";
  console.error("AI gateway error", status, body);
  return "The AI service is unavailable right now. Please try again.";
}

function extractJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        /* fall through */
      }
    }
    throw new AIError("The AI returned an unreadable response. Please try again.", 502);
  }
}

export async function generateJson<T = Record<string, unknown>>(opts: {
  system: string;
  prompt: string;
  model?: string;
}): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AIError("AI is not configured for this project.", 500);

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: opts.model ?? DEFAULT_MODEL,
      messages: [
        { role: "system", content: `${opts.system}\n\nAlways reply with a single valid JSON object and nothing else.` },
        { role: "user", content: opts.prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new AIError(friendly(res.status, body), res.status);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!content) throw new AIError("The AI returned an empty response. Please try again.", 502);
  return extractJson(content) as T;
}

/** Scores from a model are never trusted blindly. */
export function safeScore(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function safeList(value: unknown, max = 25): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string" && v.trim().length > 0)
    .slice(0, max)
    .map((v) => (v as string).trim());
}
