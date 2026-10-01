"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { Button } from "./ui";

type DictInfo = { ipa: string; defs: string[] };

/** Khung lưu từ mới vào flashcard (truyền key={word} để reset khi đổi từ). Tự tra phiên âm + định nghĩa tiếng Anh (cần mạng, không bắt buộc). */
export function SaveWordPanel({ word, sentence, onClose }: { word: string; sentence: string; onClose: () => void }) {
  const { allCards, update, progress } = useProgress();
  const [meaning, setMeaning] = useState("");
  const [info, setInfo] = useState<DictInfo | null>(null);
  const [saved, setSaved] = useState(false);
  const id = "custom-" + word.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const existing = allCards.find((c) => c.word.toLowerCase() === word.toLowerCase());

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!Array.isArray(data)) return;
        const e = data[0];
        const ipa = e.phonetic || e.phonetics?.find((p: { text?: string }) => p.text)?.text || "";
        const defs = (e.meanings || [])
          .slice(0, 2)
          .map((m: { partOfSpeech: string; definitions: { definition: string }[] }) => `(${m.partOfSpeech}) ${m.definitions[0]?.definition}`);
        setInfo({ ipa, defs });
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [word]);

  function save() {
    update((p) => {
      p.customCards = p.customCards.filter((c) => c.id !== id);
      p.customCards.push({
        id,
        word,
        ipa: info?.ipa || "",
        meaning: meaning.trim() || info?.defs[0] || "",
        example: sentence,
        topic: "Từ tôi lưu",
        week: null,
        source: "custom",
      });
    });
    setSaved(true);
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <button className="text-lg font-bold hover:text-vocab" onClick={() => speak(word, progress.settings)}>
            {word} 🔊
          </button>
          {info?.ipa && <span className="ml-2 text-sm text-muted">{info.ipa}</span>}
        </div>
        <button onClick={onClose} className="text-muted hover:text-text" aria-label="Đóng">
          ✕
        </button>
      </div>
      {info?.defs.map((d, i) => (
        <p key={i} className="mt-1 text-sm text-muted">
          {d}
        </p>
      ))}
      {existing ? (
        <p className="mt-3 text-sm">
          Đã có trong flashcard: <b>{existing.meaning}</b>
        </p>
      ) : saved ? (
        <p className="mt-3 text-sm text-ok">✓ Đã lưu vào flashcard (chủ đề “Từ tôi lưu”)</p>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            autoFocus
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="Nghĩa tiếng Việt…"
            className="flex-1 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm"
          />
          <Button onClick={save}>Lưu</Button>
        </div>
      )}
    </div>
  );
}
