"use client";

import { useState } from "react";
import Link from "next/link";
import { PASSAGES, estimateBand } from "@/content/reading";
import { useProgress } from "@/lib/progress";
import { Card, PageHeader, Pill } from "@/components/ui";

const TYPE_LABEL: Record<string, string> = {
  tfng: "True/False/Not Given",
  mcq: "Multiple choice",
  gap: "Điền từ",
  choice: "Matching",
};

export default function ReadingList() {
  const { progress } = useProgress();
  const [topic, setTopic] = useState("all");
  const topics = [...new Set(PASSAGES.map((p) => p.topic))];
  return (
    <div>
      <PageHeader
        title="Reading"
        color="var(--read)"
        subtitle="Mỗi ngày làm 1 bài, bấm giờ như thi thật. Bôi đen từ lạ trong bài để lưu vào flashcard. Sau khi nộp, đọc kỹ phần giải thích, nhất là các câu NOT GIVEN."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", ...topics].map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-3 py-1 text-sm ${topic === t ? "border-read bg-accent-soft text-read" : "border-border"}`}
          >
            {t === "all" ? `Tất cả (${PASSAGES.length})` : t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {PASSAGES.filter((p) => topic === "all" || p.topic === topic).map((p) => {
          const attempts = progress.reading[p.id] || [];
          const best = attempts.reduce((m, a) => Math.max(m, a.score / a.total), -1);
          const total = p.groups.reduce((s, g) => s + g.questions.length, 0);
          const types = [...new Set(p.groups.flatMap((g) => g.questions.map((q) => q.type)))];
          return (
            <Link key={p.id} href={`/reading/${p.id}`}>
              <Card className="h-full hover:border-read transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                  <Pill color="var(--read)">{p.level}</Pill>
                </div>
                <p className="text-sm text-muted mt-1">
                  {p.topic} · {total} câu · {p.minutes} phút
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {types.map((t) => (
                    <Pill key={t}>{TYPE_LABEL[t]}</Pill>
                  ))}
                </div>
                <p className="mt-3 text-sm">
                  {best < 0 ? (
                    <span className="text-muted">Chưa làm</span>
                  ) : (
                    <span>
                      Tốt nhất: <b>{Math.round(best * 100)}%</b> (≈ band {estimateBand(best, 1)}) · {attempts.length} lần làm
                    </span>
                  )}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
      <Card className="mt-6 text-sm text-muted">
        <b className="text-text">Mẹo chuyển từ TOEIC sang IELTS Reading:</b> TOEIC không có dạng <b>NOT GIVEN</b> — đây là dạng người
        mới hay sai nhất. Chỉ chọn FALSE khi bài nói <i>ngược lại</i>; nếu bài <i>không nhắc tới</i> thì chọn NOT GIVEN, dù bạn
        biết ngoài đời điều đó đúng hay sai.
      </Card>
    </div>
  );
}
