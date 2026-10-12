"use client";

import { useEffect, useRef, useState } from "react";
import { requestGrade } from "@/lib/grade-client";
import { useProgress } from "@/lib/progress";
import { startStt, sttSupported, type Stt } from "@/lib/stt";
import { today } from "@/lib/date";
import type { AiGrade } from "@/lib/types";
import { GradeCard } from "./GradeCard";
import { Recorder } from "./Recorder";
import { Button } from "./ui";

/**
 * Ghi âm + chép lời tự động (Web Speech API) + AI chấm trên bản chép.
 * Lời chép có thể sai chỗ — người học sửa lại trong ô văn bản trước khi chấm.
 */
export function SpeakingAnswer({ part, question }: { part: "p1" | "p2" | "p3"; question: string }) {
  const { update, updateDay } = useProgress();
  const [transcript, setTranscript] = useState("");
  const [note, setNote] = useState("");
  const [listening, setListening] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");
  const [grade, setGrade] = useState<AiGrade | null>(null);
  const stt = useRef<Stt | null>(null);
  const startedAt = useRef(0);
  const seconds = useRef(0);
  const supported = typeof window !== "undefined" && sttSupported();

  useEffect(() => () => stt.current?.stop(), []);

  function onStart() {
    startedAt.current = Date.now();
    setGrade(null);
    setNote("");
    if (!supported) return;
    stt.current?.stop();
    setTranscript("");
    stt.current = startStt(setTranscript, setNote);
    setListening(!!stt.current);
  }

  function onRecorded() {
    seconds.current = Math.round((Date.now() - startedAt.current) / 1000);
    stt.current?.stop();
    stt.current = null;
    setListening(false);
  }

  async function gradeNow() {
    setGrading(true);
    setError("");
    try {
      const g = await requestGrade({ type: "speaking", part, question, transcript, seconds: seconds.current });
      setGrade(g);
      update((p) => {
        p.speaking = [
          { id: `${Date.now()}`, part, question, transcript, seconds: seconds.current, date: today(), grade: g },
          ...(p.speaking ?? []),
        ].slice(0, 100);
      });
      updateDay((d) => void (d.manual.speaking = true));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chấm bài thất bại.");
    } finally {
      setGrading(false);
    }
  }

  const words = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <Recorder onStart={onStart} onRecorded={onRecorded} />
      {listening && <p className="text-sm text-ok">🎧 Đang chép lời… hãy nói rõ ràng.</p>}
      {!supported && (
        <p className="text-sm text-warn">Trình duyệt này không hỗ trợ chép lời tự động (dùng Chrome hoặc Edge). Bạn có thể tự gõ lại lời mình nói vào ô dưới.</p>
      )}
      {note && <p className="text-sm text-warn">{note}</p>}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={4}
        placeholder="Lời bạn nói sẽ hiện ở đây. Sửa lại chỗ nhận diện sai trước khi chấm."
        className="w-full rounded-lg border border-border bg-bg p-3 text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={gradeNow} disabled={words < 8 || grading || listening}>
          {grading ? "⏳ AI đang chấm…" : "🤖 Chấm bằng AI"}
        </Button>
        <span className="text-xs text-muted">{words} từ · AI chỉ chấm nội dung/ngữ pháp/từ vựng, không chấm phát âm.</span>
      </div>
      {error && <p className="text-sm text-bad">{error}</p>}
      {grade && <GradeCard grade={grade} />}
    </div>
  );
}
