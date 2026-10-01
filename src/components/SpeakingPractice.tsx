"use client";

import { useEffect, useState } from "react";
import { ANSWER_TIPS, CUE_CARDS, PART1 } from "@/content/speaking";
import { useProgress } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { Recorder } from "./Recorder";
import { Button, Card } from "./ui";

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function SpeakingPractice() {
  const [part, setPart] = useState<"p1" | "p2">("p1");
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button variant={part === "p1" ? "primary" : "outline"} onClick={() => setPart("p1")}>
          Part 1 — Câu hỏi ngắn
        </Button>
        <Button variant={part === "p2" ? "primary" : "outline"} onClick={() => setPart("p2")}>
          Part 2 + 3 — Cue card
        </Button>
      </div>
      {part === "p1" ? <Part1 /> : <Part2 />}
    </div>
  );
}

function Part1() {
  const { progress } = useProgress();
  const [topicIdx, setTopicIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const topic = PART1[topicIdx];
  const question = topic.questions[qIdx];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={topicIdx}
            onChange={(e) => {
              setTopicIdx(Number(e.target.value));
              setQIdx(0);
            }}
            className="rounded-lg border border-border bg-bg px-3 py-2"
          >
            {PART1.map((t, i) => (
              <option key={t.topic} value={i}>
                {t.topic}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            onClick={() => {
              setTopicIdx(Math.floor(Math.random() * PART1.length));
              setQIdx(0);
            }}
          >
            🎲 Chủ đề ngẫu nhiên
          </Button>
          <span className="ml-auto text-sm text-muted">
            Câu {qIdx + 1}/{topic.questions.length}
          </span>
        </div>
        <p className="mt-6 text-2xl font-semibold">{question}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => speak(question, progress.settings)}>
            🔊 Nghe câu hỏi
          </Button>
        </div>
        <div className="mt-5">
          <Recorder key={`${topicIdx}-${qIdx}`} />
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" disabled={qIdx === 0} onClick={() => setQIdx((i) => i - 1)}>
            ← Câu trước
          </Button>
          <Button disabled={qIdx === topic.questions.length - 1} onClick={() => setQIdx((i) => i + 1)}>
            Câu tiếp →
          </Button>
        </div>
      </Card>
      <Card className="text-sm">
        <div className="font-semibold mb-2">Cách trả lời Part 1</div>
        <p className="text-muted">{ANSWER_TIPS.part1}</p>
        <div className="font-semibold mt-4 mb-2">Tất cả câu hỏi</div>
        <ol className="list-decimal pl-4 space-y-1 text-muted">
          {topic.questions.map((q, i) => (
            <li key={q} className={i === qIdx ? "text-text font-medium" : ""}>
              <button className="text-left" onClick={() => setQIdx(i)}>
                {q}
              </button>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

type Phase = "ready" | "prep" | "talk" | "done";

function Part2() {
  const { progress } = useProgress();
  const [card, setCard] = useState(() => CUE_CARDS[0]);
  const [phase, setPhase] = useState<Phase>("ready");
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (phase !== "prep" && phase !== "talk") return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Hết giờ chuẩn bị → chuyển sang nói; hết giờ nói → xong
  if ((phase === "prep" || phase === "talk") && left <= 0) {
    if (phase === "prep") {
      setPhase("talk");
      setLeft(120);
    } else setPhase("done");
  }

  function choose(id: string) {
    setCard(CUE_CARDS.find((c) => c.id === id)!);
    setPhase("ready");
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <select value={card.id} onChange={(e) => choose(e.target.value)} className="flex-1 min-w-52 rounded-lg border border-border bg-bg px-3 py-2">
              {CUE_CARDS.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.topic}] {c.title}
                </option>
              ))}
            </select>
            <Button variant="ghost" onClick={() => choose(pick(CUE_CARDS).id)}>
              🎲 Ngẫu nhiên
            </Button>
          </div>
          <div className="rounded-xl border-2 border-speak p-5">
            <p className="text-lg font-semibold">{card.title}</p>
            <p className="mt-3 text-sm text-muted">You should say:</p>
            <ul className="mt-1 list-disc pl-5 space-y-0.5">
              {card.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {phase === "ready" && (
              <Button
                onClick={() => {
                  setPhase("prep");
                  setLeft(60);
                }}
              >
                ▶ Bắt đầu: 1 phút chuẩn bị
              </Button>
            )}
            {phase === "prep" && (
              <>
                <span className="rounded-lg bg-warn-soft px-4 py-2 font-mono text-lg text-warn">Chuẩn bị {fmt(left)}</span>
                <Button variant="outline" onClick={() => setLeft(0)}>
                  Nói luôn →
                </Button>
              </>
            )}
            {phase === "talk" && (
              <>
                <span className="rounded-lg bg-ok-soft px-4 py-2 font-mono text-lg text-ok">Nói {fmt(left)}</span>
                <Button variant="outline" onClick={() => setPhase("done")}>
                  Kết thúc
                </Button>
              </>
            )}
            {phase === "done" && <span className="text-ok font-semibold">✓ Xong! Nghe lại bản ghi và trả lời Part 3 bên dưới.</span>}
            {phase !== "ready" && (
              <Button variant="ghost" onClick={() => setPhase("ready")}>
                Làm lại
              </Button>
            )}
          </div>
          {phase === "prep" && (
            <textarea rows={3} placeholder="Ghi từ khóa ở đây…" className="mt-3 w-full rounded-lg border border-border bg-bg p-3 text-sm" />
          )}
          <div className="mt-4">
            <Recorder key={card.id} />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Part 3 — Thảo luận</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {card.part3.map((q) => (
              <li key={q}>
                {q}{" "}
                <button className="text-sm text-speak" onClick={() => speak(q, progress.settings)}>
                  🔊
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-4">
            <Recorder key={`${card.id}-p3`} />
          </div>
        </Card>
      </div>
      <Card className="text-sm h-fit">
        <div className="font-semibold mb-2">Cách làm Part 2</div>
        <p className="text-muted">{ANSWER_TIPS.part2}</p>
        <div className="font-semibold mt-4 mb-2">Cách làm Part 3</div>
        <p className="text-muted">{ANSWER_TIPS.part3}</p>
        <p className="mt-4 text-muted">
          💡 Mở <b className="text-text">Từ vựng → Chủ đề</b>, tick chủ đề <b className="text-text">{card.topic}</b> để học từ cho đề này.
        </p>
      </Card>
    </div>
  );
}
