"use client";

import { useState } from "react";
import { PASSAGES } from "@/content/reading";
import { READ_WRITE, SUMMARY_TASK } from "@/content/writing-reading";
import { today } from "@/lib/date";
import { useProgress } from "@/lib/progress";
import { Button, Card } from "../ui";
import { countWords } from "./EssayEditor";
import { EssayHistory } from "./EssayHistory";

/** Đọc bài Reading rồi viết câu trả lời bằng lời của mình, so sánh với câu trả lời mẫu. */
export function ReadWritePractice() {
  const [passageId, setPassageId] = useState(READ_WRITE[0].passageId);
  const set = READ_WRITE.find((s) => s.passageId === passageId)!;
  const passage = PASSAGES.find((p) => p.id === passageId)!;

  return (
    <div>
      <Card className="mb-4 text-sm">
        <b>Cách luyện:</b> đọc bài → trả lời từng câu bằng <b>câu hoàn chỉnh</b> và <b>từ của bạn</b> (đừng chép nguyên câu trong bài) → bấm
        “So sánh với câu mẫu”. Cuối cùng viết tóm tắt cả bài. Đây là cách luyện paraphrase rất tốt cho cả Reading lẫn Writing.
      </Card>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={passageId} onChange={(e) => setPassageId(e.target.value)} className="flex-1 min-w-52 rounded-lg border border-border bg-bg px-3 py-2">
          {READ_WRITE.map((s) => {
            const p = PASSAGES.find((x) => x.id === s.passageId)!;
            return (
              <option key={s.passageId} value={s.passageId}>
                [{p.topic}] {p.title} — {p.level}
              </option>
            );
          })}
        </select>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <h2 className="mb-3 text-lg font-bold">{passage.title}</h2>
          <div className="space-y-4 leading-relaxed">
            {passage.paragraphs.map((para) => (
              <p key={para.label}>
                <b className="mr-2 text-read">{para.label}</b>
                {para.text}
              </p>
            ))}
          </div>
        </Card>
        <div key={passageId} className="space-y-4">
          {set.questions.map((q, i) => (
            <AnswerBox key={q.q} index={i + 1} question={q.q} model={q.model} passageId={passageId} rows={3} />
          ))}
          <AnswerBox index={set.questions.length + 1} question={SUMMARY_TASK} model={set.summary} passageId={passageId} rows={6} summary />
          <EssayHistory kind="readwrite" />
        </div>
      </div>
    </div>
  );
}

function AnswerBox({
  index,
  question,
  model,
  passageId,
  rows,
  summary,
}: {
  index: number;
  question: string;
  model: string;
  passageId: string;
  rows: number;
  summary?: boolean;
}) {
  const { update, updateDay } = useProgress();
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);
  const words = countWords(text);

  function compare() {
    setShown(true);
    if (words < 3) return;
    const essay = { id: `${Date.now()}`, kind: "readwrite" as const, promptId: passageId, prompt: question, text, words, seconds: 0, date: today() };
    update((p) => void (p.essays = [essay, ...p.essays]));
    if (summary && words >= 40) updateDay((d) => void (d.manual.writing = true));
  }

  return (
    <Card>
      <p className="font-medium">
        <b className="mr-1 text-write">{index}.</b>
        {question}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={shown}
        rows={rows}
        spellCheck={false}
        placeholder="Viết câu trả lời bằng lời của bạn…"
        className="mt-2 w-full rounded-lg border border-border bg-bg p-3 text-sm leading-relaxed"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {!shown ? (
          <Button variant="outline" onClick={compare} disabled={words < 3}>
            So sánh với câu mẫu
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setShown(false)}>
            ✏️ Sửa lại
          </Button>
        )}
        <span className="text-xs text-muted">{words} từ</span>
      </div>
      {shown && (
        <div className="mt-3 rounded-lg bg-ok-soft p-3 text-sm">
          <div className="mb-1 text-xs font-semibold text-ok">{summary ? "Tóm tắt mẫu" : "Câu trả lời mẫu"}</div>
          {model}
          <p className="mt-2 text-xs text-muted">
            So sánh: bạn có trả lời đúng ý chính không? Có dùng từ đồng nghĩa thay vì chép nguyên văn không? Câu có đủ chủ ngữ – động từ không?
          </p>
        </div>
      )}
    </Card>
  );
}
