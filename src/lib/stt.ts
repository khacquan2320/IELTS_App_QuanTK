"use client";

// Chép lời bằng Web Speech API của trình duyệt (Chrome/Edge). Firefox chưa hỗ trợ → người dùng tự gõ lời.

type Alt = { transcript: string };
type Result = { isFinal: boolean; 0: Alt };
type RecEvent = { resultIndex: number; results: ArrayLike<Result> };
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void;
  stop(): void;
}
type Ctor = new () => Recognition;

function ctor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const sttSupported = () => ctor() !== null;

export type Stt = { stop: () => void };

/**
 * Bắt đầu chép lời liên tục. `onText` nhận toàn bộ lời đã nhận diện (đã chốt + đang nói) mỗi lần thay đổi.
 * Chrome tự ngắt sau một đoạn im lặng nên sẽ tự khởi động lại cho tới khi gọi stop().
 */
export function startStt(onText: (full: string) => void, onProblem: (msg: string) => void): Stt | null {
  const C = ctor();
  if (!C) return null;
  const rec = new C();
  rec.lang = "en-GB";
  rec.continuous = true;
  rec.interimResults = true;
  let finalText = "";
  let wanted = true;

  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript + " ";
      else interim += r[0].transcript;
    }
    onText((finalText + interim).trim());
  };
  rec.onerror = (e) => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      wanted = false;
      onProblem("Trình duyệt không cho chép lời. Bạn có thể tự gõ lời vào ô bên dưới.");
    }
  };
  rec.onend = () => {
    if (wanted) {
      try {
        rec.start();
      } catch {
        /* đang chạy rồi */
      }
    }
  };
  try {
    rec.start();
  } catch {
    return null;
  }
  return {
    stop: () => {
      wanted = false;
      rec.stop();
    },
  };
}
