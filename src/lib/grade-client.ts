"use client";

import { supabase } from "./supabase";
import type { AiGrade } from "./types";

/** Gửi bài lên /api/grade kèm token đăng nhập; ném Error với thông báo tiếng Việt nếu thất bại. */
export async function requestGrade(payload: Record<string, unknown>): Promise<AiGrade> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Bạn cần đăng nhập lại.");
  let res: Response;
  try {
    res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Không gửi được bài (mất mạng?).");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.grade) throw new Error(json.error || "Chấm bài thất bại, hãy thử lại.");
  return json.grade as AiGrade;
}
