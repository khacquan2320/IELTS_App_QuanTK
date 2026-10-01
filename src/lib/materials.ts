import data from "@/content/materials.json";
import { BUCKET, supabase } from "./supabase";

export type MaterialKind = "audio" | "pdf" | "doc" | "image";
/** key = tên file trên Supabase Storage (docx đã được chuyển sẵn thành .html) */
export type Material = { key: string; path: string; name: string; dir: string; kind: MaterialKind; week: number | null; skill: string | null };

export const MATERIALS = data as Material[];

/** Link tạm (1 giờ) để phát audio / xem pdf, ảnh trong bucket riêng tư. */
export async function signedUrl(key: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(key, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function downloadText(key: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).download(key);
  if (error) throw error;
  return data.text();
}
