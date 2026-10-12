// CHỈ chạy phía server (route handler). Không import file này từ component "use client".

export class AiError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}

type Provider = "gemini" | "groq" | "ollama";

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
  ollama: "llama3.1",
};

export function activeProvider(): Provider {
  const p = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  return p === "groq" || p === "ollama" ? p : "gemini";
}

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new AiError(`Chưa cấu hình ${name} trên server (xem README → Giai đoạn 2).`, 503);
  return v;
}

async function post(url: string, init: { headers: Record<string, string>; body: unknown }) {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...init.headers },
      body: JSON.stringify(init.body),
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    throw new AiError("Không kết nối được nhà cung cấp AI (quá thời gian hoặc mất mạng).", 504);
  }
  if (res.status === 429) throw new AiError("Đã hết hạn mức miễn phí của AI. Hãy thử lại sau ít phút.", 429);
  if (res.status === 401 || res.status === 403) throw new AiError("API key của AI không hợp lệ hoặc bị từ chối.", 502);
  if (!res.ok) throw new AiError(`AI trả lỗi ${res.status}.`, 502);
  return res.json();
}

/** Gọi nhà cung cấp AI đã chọn (AI_PROVIDER) và trả về JSON đã parse + tên model. */
export async function generateJson(system: string, user: string): Promise<{ data: unknown; model: string }> {
  const provider = activeProvider();
  const model = process.env.AI_MODEL || DEFAULT_MODEL[provider];
  let text = "";

  if (provider === "gemini") {
    const json = await post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      headers: { "x-goog-api-key": need("GEMINI_API_KEY") },
      body: {
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      },
    });
    text = (json?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  } else if (provider === "groq") {
    const json = await post("https://api.groq.com/openai/v1/chat/completions", {
      headers: { Authorization: `Bearer ${need("GROQ_API_KEY")}` },
      body: {
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
    });
    text = json?.choices?.[0]?.message?.content ?? "";
  } else {
    // Ollama chỉ dùng được khi chạy app trên máy bạn (npm run dev), không dùng được trên Vercel.
    const base = process.env.OLLAMA_URL || "http://localhost:11434";
    const json = await post(`${base}/api/chat`, {
      headers: {},
      body: {
        model,
        stream: false,
        format: "json",
        options: { temperature: 0.3 },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
    });
    text = json?.message?.content ?? "";
  }

  if (!text) throw new AiError("AI không trả về nội dung (có thể bị chặn bởi bộ lọc an toàn).", 502);
  try {
    return { data: JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, "")), model };
  } catch {
    throw new AiError("AI trả về dữ liệu không đúng định dạng. Hãy bấm chấm lại.", 502);
  }
}
