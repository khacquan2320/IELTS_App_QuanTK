"use client";

import { useEffect, useState } from "react";
import { today } from "@/lib/date";
import { requestGrade } from "@/lib/grade-client";
import { useProgress } from "@/lib/progress";
import type { AiGrade, EssayKind } from "@/lib/types";
import { GradeCard } from "../GradeCard";
import { Button, Card } from "../ui";

export const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const fmt = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, "0")}`;

/**
 * Khung viết bài có bấm giờ + đếm từ + lưu bài. Truyền key={promptId} ở component cha để reset khi đổi đề.
 * Lưu bài đủ `minWords` sẽ tự đánh dấu xong nhiệm vụ Writing hôm nay.
 */
export function EssayEditor({
  kind,
  promptId,
  prompt,
  minutes,
  minWords,
  rows = 16,
  context,
}: {
  kind: EssayKind;
  promptId: string;
  prompt: string;
  minutes: number;
  minWords: number;
  rows?: number;
  /** Dữ liệu biểu đồ (Task 1) để AI đối chiếu số liệu */
  context?: string;
}) {
  const { update, updateDay } = useProgress();
  const [text, setText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState("");
  const [grade, setGrade] = useState<AiGrade | null>(null);
  const words = countWords(text);
  const remaining = minutes * 60 - elapsed;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  function save() {
    const essay = { id: `${Date.now()}`, kind, promptId, prompt, text, words, seconds: elapsed, date: today() };
    update((p) => void (p.essays = [essay, ...p.essays]));
    if (words >= Math.min(minWords, 100)) updateDay((d) => void (d.manual.writing = true));
    setRunning(false);
    setSaved(true);
    setSavedId(essay.id);
    return essay.id;
  }

  /** Lưu bài (nếu chưa lưu) rồi gửi AI chấm; kết quả gắn vào bài đã lưu. */
  async function gradeWithAi() {
    const id = saved && savedId ? savedId : save();
    setGrading(true);
    setGradeError("");
    try {
      const g = await requestGrade({ type: "writing", kind, prompt, context, text, seconds: elapsed });
      update((p) => {
        const e = p.essays.find((x) => x.id === id);
        if (e) e.grade = g;
      });
      setGrade(g);
    } catch (e) {
      setGradeError(e instanceof Error ? e.message : "Chấm bài thất bại.");
    } finally {
      setGrading(false);
    }
  }

  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
        <span className={`font-semibold ${words >= minWords ? "text-ok" : words >= minWords * 0.6 ? "text-warn" : "text-muted"}`}>
          {words}/{minWords} từ
        </span>
        <span
          className={`rounded-lg px-3 py-1 font-mono ${
            !running && elapsed === 0
              ? "bg-bg text-muted"
              : remaining < 0
                ? "bg-bad-soft text-bad"
                : remaining < 180
                  ? "bg-warn-soft text-warn"
                  : "bg-accent-soft text-accent"
          }`}
        >
          {!running && elapsed === 0
            ? `⏱ ${minutes}:00 (bắt đầu khi gõ)`
            : remaining >= 0
              ? `⏱ ${fmt(remaining)}`
              : `Quá giờ +${fmt(remaining)}`}
        </span>
        {running && (
          <Button variant="ghost" onClick={() => setRunning(false)}>
            ⏸ Tạm dừng
          </Button>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (!running) setRunning(true);
          setSaved(false);
          setSavedId(null);
          setGrade(null);
        }}
        rows={rows}
        spellCheck={false}
        placeholder="Viết ở đây… (đã tắt kiểm tra chính tả để giống phòng thi)"
        className="w-full rounded-lg border border-border bg-bg p-4 leading-relaxed"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={words < 10}>
          💾 Lưu bài
        </Button>
        <Button variant="outline" onClick={gradeWithAi} disabled={words < 30 || grading}>
          {grading ? "⏳ AI đang chấm…" : "🤖 Chấm bằng AI"}
        </Button>
        {saved && <span className="text-sm text-ok">✓ Đã lưu vào “Bài đã viết”.</span>}
      </div>
      {gradeError && <p className="mt-2 text-sm text-bad">{gradeError}</p>}
      {grade && (
        <div className="mt-4">
          <GradeCard grade={grade} />
        </div>
      )}
    </Card>
  );
}
