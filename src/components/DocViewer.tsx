"use client";

import { useEffect, useState } from "react";
import { downloadText, signedUrl, type Material } from "@/lib/materials";

/** Tải link tạm của 1 file trong bucket riêng tư. Truyền key={file.key} ở component cha khi đổi file. */
export function useSignedUrl(key: string | null) {
  const [state, setState] = useState<{ key: string; url: string | null } | null>(null);
  useEffect(() => {
    if (!key) return;
    signedUrl(key)
      .then((url) => setState({ key, url }))
      .catch(() => setState({ key, url: null }));
  }, [key]);
  if (!key || state?.key !== key) return { url: null, loading: !!key, error: false };
  return { url: state.url, loading: false, error: state.url === null };
}

/** Hiển thị tài liệu khóa học: docx (đã chuyển sẵn sang HTML), pdf (trình xem của trình duyệt), ảnh. */
export function DocViewer({ file, className = "" }: { file: Material; className?: string }) {
  if (file.kind === "doc") return <DocHtml file={file} className={className} />;
  return <DocFile file={file} className={className} />;
}

function DocHtml({ file, className }: { file: Material; className: string }) {
  const [doc, setDoc] = useState<{ key: string; html: string | null } | null>(null);
  useEffect(() => {
    downloadText(file.key)
      .then((html) => setDoc({ key: file.key, html }))
      .catch(() => setDoc({ key: file.key, html: null }));
  }, [file.key]);

  if (doc?.key !== file.key) return <p className="text-muted">Đang tải tài liệu…</p>;
  if (doc.html === null) return <p className="text-bad">Không mở được file. Đã chạy “npm run upload” chưa?</p>;
  return <div className={`doc-html ${className}`} dangerouslySetInnerHTML={{ __html: doc.html }} />;
}

function DocFile({ file, className }: { file: Material; className: string }) {
  const { url, loading, error } = useSignedUrl(file.key);
  if (loading) return <p className="text-muted">Đang tải tài liệu…</p>;
  if (error || !url) return <p className="text-bad">Không mở được file. Đã chạy “npm run upload” chưa?</p>;
  if (file.kind === "pdf") return <iframe src={url} className={`w-full h-[75vh] rounded-lg border border-border ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={file.name} className={`max-w-full rounded-lg ${className}`} />;
}
