"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.startsWith("en"));
  if (v.length) cachedVoices = v;
  return cachedVoices;
}

/** Giọng mặc định: ưu tiên giọng Anh-Anh (IELTS dùng giọng Anh nhiều nhất). */
function pickVoice(name: string): SpeechSynthesisVoice | undefined {
  const voices = getVoices();
  return (
    voices.find((v) => v.name === name) ||
    voices.find((v) => v.lang === "en-GB" && /natural|online/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-GB") ||
    voices[0]
  );
}

export function speak(text: string, opts: { rate?: number; voice?: string; onEnd?: () => void } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(opts.voice || "");
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else u.lang = "en-GB";
  u.rate = opts.rate ?? 0.9;
  if (opts.onEnd) u.onend = opts.onEnd;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}
