"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui";

/** Ghi âm bằng micro của trình duyệt để tự nghe lại. Bản ghi chỉ nằm trên máy, không tải lên đâu cả. */
export function Recorder({ onRecorded }: { onRecorded?: () => void }) {
  const [state, setState] = useState<"idle" | "recording" | "error">("idle");
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const rec = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (state !== "recording") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: Blob[] = [];
      const r = new MediaRecorder(stream);
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setUrl(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })));
        setState("idle");
        onRecorded?.();
      };
      r.start();
      rec.current = r;
      setUrl(null);
      setSeconds(0);
      setState("recording");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {state === "recording" ? (
        <Button variant="outline" onClick={() => rec.current?.stop()} className="border-bad text-bad">
          ⏹ Dừng ghi ({Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")})
        </Button>
      ) : (
        <Button variant="outline" onClick={start}>
          🎙 {url ? "Ghi lại" : "Ghi âm câu trả lời"}
        </Button>
      )}
      {url && <audio src={url} controls className="h-9" />}
      {state === "error" && <span className="text-sm text-bad">Không mở được micro. Hãy cho phép trình duyệt dùng micro.</span>}
    </div>
  );
}
