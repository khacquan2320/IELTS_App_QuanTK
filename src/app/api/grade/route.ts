import { createClient } from "@supabase/supabase-js";
import { AiError, generateJson } from "@/lib/ai/providers";
import { normalizeGrade, speakingPrompt, writingPrompt } from "@/lib/ai/grading";

export const maxDuration = 60;

const MAX_CHARS = 6000;

const fail = (error: string, status: number) => Response.json({ error }, { status });
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(v, 7200)) : 0);

/** Chấm Writing / Speaking bằng AI. Chỉ người đã đăng nhập mới gọi được; API key AI chỉ nằm ở server. */
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return fail("Bạn cần đăng nhập.", 401);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fail("Server chưa cấu hình Supabase.", 503);
  const { data: auth, error: authError } = await createClient(url, key).auth.getUser(token);
  if (authError || !auth.user) return fail("Phiên đăng nhập hết hạn, hãy đăng nhập lại.", 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Yêu cầu không hợp lệ.", 400);
  }

  try {
    const date = new Date().toISOString().slice(0, 10);
    if (body.type === "writing") {
      const text = clean(body.text, MAX_CHARS);
      if (text.split(/\s+/).length < 30) return fail("Bài quá ngắn để chấm (cần ít nhất 30 từ).", 400);
      const kind = body.kind === "task1" ? "task1" : "task2";
      const { system, user } = writingPrompt({
        kind,
        prompt: clean(body.prompt, 1500),
        context: clean(body.context, 2000) || undefined,
        text,
        seconds: num(body.seconds),
      });
      const { data, model } = await generateJson(system, user);
      return Response.json({ grade: normalizeGrade(data, model, date, 4) });
    }
    if (body.type === "speaking") {
      const transcript = clean(body.transcript, MAX_CHARS);
      if (transcript.split(/\s+/).length < 8) return fail("Bản chép lời quá ngắn để chấm (cần ít nhất 8 từ).", 400);
      const part = body.part === "p2" || body.part === "p3" ? body.part : "p1";
      const { system, user } = speakingPrompt({ part, question: clean(body.question, 1500), transcript, seconds: num(body.seconds) });
      const { data, model } = await generateJson(system, user);
      return Response.json({ grade: normalizeGrade(data, model, date, 3) });
    }
    return fail("Loại bài chấm không hợp lệ.", 400);
  } catch (e) {
    if (e instanceof AiError) return fail(e.message, e.status);
    if (e instanceof Error && e.message === "incomplete") return fail("AI trả kết quả thiếu mục. Hãy bấm chấm lại.", 502);
    return fail("Lỗi không xác định khi chấm bài.", 500);
  }
}
