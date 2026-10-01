"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PASSAGES, estimateBand, normalizeAnswer, type Question } from "@/content/reading";
import { today } from "@/lib/date";
import { useProgress } from "@/lib/progress";
import { Button, Card } from "@/components/ui";
import { SaveWordPanel } from "@/components/SaveWordPanel";

function isCorrect(q: Question, a: string | undefined) {
  if (a === undefined || a === "") return false;
  switch (q.type) {
    case "tfng":
      return a === q.answer;
    case "mcq":
      return Number(a) === q.answer;
    case "choice":
      return a === q.answer;
    case "gap":
      return q.answers.some((x) => normalizeAnswer(x) === normalizeAnswer(a));
  }
}

function correctText(q: Question, options?: [string, string][]) {
  switch (q.type) {
    case "tfng":
      return q.answer;
    case "mcq":
      return `${"ABCD"[q.answer]}. ${q.options[q.answer]}`;
    case "choice": {
      const o = options?.find(([k]) => k === q.answer);
      return o ? `${o[0]}. ${o[1]}` : q.answer;
    }
    case "gap":
      return q.answers.join(" / ");
  }
}

export default function ReadingPractice() {
  const { id } = useParams<{ id: string }>();
  const passage = PASSAGES.find((p) => p.id === id);
  const { update, updateDay } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selection, setSelection] = useState<{ word: string; sentence: string } | null>(null);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  if (!passage) return <Card>Không tìm thấy bài đọc. <Link href="/reading">Quay lại</Link></Card>;

  const allQ = passage.groups.flatMap((g) => g.questions);
  const score = allQ.filter((q) => isCorrect(q, answers[q.id])).length;
  const limit = passage.minutes * 60;
  const remaining = limit - elapsed;
  const fmt = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, "0")}`;

  function submit() {
    if (!passage) return;
    setSubmitted(true);
    update((p) => {
      p.reading[passage.id] = [...(p.reading[passage.id] || []), { date: today(), score, total: allQ.length, seconds: elapsed }];
    });
    updateDay((d) => {
      if (!d.readingDone.includes(passage.id)) d.readingDone.push(passage.id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setElapsed(0);
  }

  function onMouseUp() {
    const sel = window.getSelection();
    const word = sel?.toString().trim().replace(/[.,;:!?“”"()]/g, "");
    if (!word || word.split(/\s+/).length > 5) return;
    const block = sel?.anchorNode?.parentElement?.textContent || "";
    const sentence = block.split(/(?<=[.!?])\s+/).find((s) => s.includes(word)) || "";
    setSelection({ word, sentence });
  }

  const set = (qid: string, v: string) => !submitted && setAnswers((a) => ({ ...a, [qid]: v }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/reading" className="text-sm text-muted hover:text-text">
          ← Danh sách bài
        </Link>
        <h1 className="text-xl font-bold">{passage.title}</h1>
        <span
          className={`ml-auto rounded-lg px-3 py-1 font-mono text-sm ${
            remaining < 0 ? "bg-bad-soft text-bad" : remaining < 180 ? "bg-warn-soft text-warn" : "bg-accent-soft text-accent"
          }`}
          title="Thời gian gợi ý"
        >
          {submitted ? `Đã làm trong ${fmt(elapsed)}` : remaining >= 0 ? `⏱ ${fmt(remaining)}` : `Quá giờ +${fmt(remaining)}`}
        </span>
      </div>

      {submitted && (
        <Card className="mb-4 flex flex-wrap items-center gap-4 border-read">
          <div className="text-3xl font-bold text-read">
            {score}/{allQ.length}
          </div>
          <div>
            <div className="font-semibold">≈ Band {estimateBand(score, allQ.length)} (ước lượng)</div>
            <div className="text-sm text-muted">Xem giải thích dưới mỗi câu. Câu sai: tìm lại đoạn văn chứa đáp án và gạch chân từ đồng nghĩa.</div>
          </div>
          <Button variant="outline" className="ml-auto" onClick={retry}>
            Làm lại
          </Button>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <p className="text-xs text-muted mb-3">💡 Bôi đen một từ hoặc cụm từ để lưu vào flashcard.</p>
          <div onMouseUp={onMouseUp} className="space-y-4 leading-relaxed">
            {passage.paragraphs.map((para) => (
              <p key={para.label}>
                <b className="text-read mr-2">{para.label}</b>
                {para.text}
              </p>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {passage.groups.map((g) => (
            <Card key={g.title}>
              <h2 className="font-semibold">{g.title}</h2>
              <p className="text-sm text-muted mt-1 mb-3">{g.instruction}</p>
              {g.options && g.options.some(([k, v]) => k !== v.replace("Paragraph ", "")) && (
                <ul className="mb-4 rounded-lg bg-bg p-3 text-sm space-y-0.5">
                  {g.options.map(([k, v]) => (
                    <li key={k}>
                      <b className="inline-block w-8">{k}</b>
                      {v}
                    </li>
                  ))}
                </ul>
              )}
              <ol className="space-y-4">
                {g.questions.map((q) => {
                  const a = answers[q.id];
                  const ok = isCorrect(q, a);
                  return (
                    <li
                      key={q.id}
                      className={`rounded-lg p-3 -mx-3 ${submitted ? (ok ? "bg-ok-soft" : "bg-bad-soft") : ""}`}
                    >
                      <div className="flex gap-2">
                        <b className="shrink-0">{q.id}.</b>
                        <div className="flex-1">
                          <QuestionInput q={q} value={a} onChange={(v) => set(q.id, v)} options={g.options} disabled={submitted} />
                          {submitted && (
                            <div className="mt-2 text-sm">
                              {!ok && (
                                <div className="text-bad">
                                  Đáp án: <b>{correctText(q, g.options)}</b>
                                </div>
                              )}
                              <div className="text-muted mt-0.5">{q.explain}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>
          ))}
          {!submitted && (
            <Button className="w-full py-3" onClick={submit}>
              Nộp bài ({Object.values(answers).filter(Boolean).length}/{allQ.length} câu đã làm)
            </Button>
          )}
        </div>
      </div>

      {selection && <SaveWordPanel key={selection.word} word={selection.word} sentence={selection.sentence} onClose={() => setSelection(null)} />}
    </div>
  );
}

function QuestionInput({
  q,
  value,
  onChange,
  options,
  disabled,
}: {
  q: Question;
  value?: string;
  onChange: (v: string) => void;
  options?: [string, string][];
  disabled: boolean;
}) {
  const choiceBtn = (label: string, v: string) => (
    <button
      key={v}
      disabled={disabled}
      onClick={() => onChange(v)}
      className={`rounded-lg border px-3 py-1.5 text-sm ${value === v ? "border-read bg-accent-soft font-semibold text-read" : "border-border hover:bg-bg"}`}
    >
      {label}
    </button>
  );

  switch (q.type) {
    case "tfng":
      return (
        <>
          <p>{q.text}</p>
          <div className="mt-2 flex flex-wrap gap-2">{(["TRUE", "FALSE", "NOT GIVEN"] as const).map((v) => choiceBtn(v, v))}</div>
        </>
      );
    case "mcq":
      return (
        <>
          <p>{q.text}</p>
          <div className="mt-2 space-y-1.5">
            {q.options.map((o, i) => (
              <label key={i} className="flex items-start gap-2 cursor-pointer">
                <input type="radio" disabled={disabled} checked={value === String(i)} onChange={() => onChange(String(i))} className="mt-1" />
                <span>
                  <b>{"ABCD"[i]}.</b> {o}
                </span>
              </label>
            ))}
          </div>
        </>
      );
    case "choice":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex-1 min-w-40">{q.text}</span>
          <select
            disabled={disabled}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-border bg-bg px-2 py-1.5 text-sm"
          >
            <option value="">— chọn —</option>
            {options?.map(([k]) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      );
    case "gap": {
      const [before, after] = q.text.split("______");
      return (
        <p className="leading-loose">
          {before}
          <input
            disabled={disabled}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="mx-1 w-40 rounded border-b-2 border-read bg-bg px-2 py-0.5"
          />
          {after}
        </p>
      );
    }
  }
}
