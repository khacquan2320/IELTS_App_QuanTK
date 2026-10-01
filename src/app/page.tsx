"use client";

import Link from "next/link";
import { addDays, today } from "@/lib/date";
import { dueCards, isActiveDay, newCardsLeft, streak, taskStatus, useProgress } from "@/lib/progress";
import { isMature } from "@/lib/srs";
import { emptyDay, type TaskKey } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";

const TASKS: { key: TaskKey; title: string; minutes: number; href: string; color: string; goal: string; auto: boolean }[] = [
  { key: "vocab", title: "Ôn từ vựng", minutes: 10, href: "/vocab", color: "var(--vocab)", goal: "Ôn hết thẻ đến hạn + học thẻ mới", auto: true },
  { key: "reading", title: "Reading", minutes: 20, href: "/reading", color: "var(--read)", goal: "Làm 1 bài đọc", auto: true },
  { key: "listening", title: "Listening", minutes: 15, href: "/listening", color: "var(--listen)", goal: "Chép chính tả 10 câu hoặc nghe 1 bài", auto: true },
  { key: "writing", title: "Writing", minutes: 15, href: "/writing", color: "var(--write)", goal: "Viết 1 bài hoặc 1 đoạn (tự xong khi lưu bài ≥100 từ)", auto: true },
  { key: "speaking", title: "Speaking", minutes: 15, href: "/speaking", color: "var(--speak)", goal: "Luyện Part 1 + 1 cue card Part 2, ghi âm nghe lại (tự đánh dấu)", auto: false },
];

export default function Home() {
  const { progress, allCards, updateDay, loaded } = useProgress();
  const date = today();
  const status = taskStatus(progress, allCards, date);
  const day = { ...emptyDay(), ...progress.days[date] };
  const doneCount = Object.values(status).filter(Boolean).length;
  const due = dueCards(progress, allCards).length;
  const fresh = newCardsLeft(progress, allCards).length;
  const learned = Object.keys(progress.cards).length;
  const mature = Object.values(progress.cards).filter(isMature).length;
  const attempts = Object.values(progress.reading).flat();
  const readingAvg = attempts.length
    ? Math.round((attempts.reduce((s, a) => s + a.score / a.total, 0) / attempts.length) * 100)
    : null;
  const dictAll = Object.values(progress.days).reduce(
    (s, d) => ({ c: s.c + (d.dictationCorrect || 0), t: s.t + (d.dictationTotal || 0) }),
    { c: 0, t: 0 },
  );

  const last14 = Array.from({ length: 14 }, (_, i) => addDays(date, i - 13));

  return (
    <div>
      <PageHeader
        title="Hôm nay học gì?"
        subtitle={
          <>
            Mục tiêu: <b>IELTS 6.0–6.5</b> · khoảng 75 phút/ngày · Đã xong <b>{doneCount}/5</b> nhiệm vụ
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {TASKS.map((t) => {
          const done = status[t.key];
          return (
            <Card key={t.key} className={`flex flex-col ${done ? "bg-ok-soft border-ok" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: t.color }}>
                  {t.title}
                </span>
                <span className="text-xs text-muted">{t.minutes}′</span>
              </div>
              <p className="mt-2 flex-1 text-sm text-muted">
                {t.goal}
                {t.key === "vocab" && loaded && (
                  <span className="block mt-1">
                    {due} thẻ cần ôn · {fresh} thẻ mới
                  </span>
                )}
                {t.key === "listening" && day.dictationTotal > 0 && (
                  <span className="block mt-1">Đã chép {day.dictationTotal} câu</span>
                )}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link href={t.href} className="text-sm font-medium" style={{ color: t.color }}>
                  {done ? "Học thêm →" : "Bắt đầu →"}
                </Link>
                <label className="ml-auto flex items-center gap-1 text-xs text-muted cursor-pointer" title="Đánh dấu đã xong">
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={t.auto && done && !day.manual[t.key]}
                    onChange={(e) => updateDay((d) => void (d.manual[t.key] = e.target.checked))}
                  />
                  Xong
                </label>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Stat label="Ngày học liên tục" value={`🔥 ${streak(progress)}`} />
        <Stat label="Từ đã học / đã thuộc" value={`${learned} / ${mature}`} hint={`trên tổng ${allCards.length} từ`} />
        <Stat label="Reading – tỉ lệ đúng TB" value={readingAvg === null ? "—" : `${readingAvg}%`} hint={`${attempts.length} lần làm`} />
        <Stat
          label="Chép chính tả – câu đúng"
          value={dictAll.t ? `${Math.round((dictAll.c / dictAll.t) * 100)}%` : "—"}
          hint={`${dictAll.t} câu`}
        />
      </div>

      <Card>
        <h2 className="font-semibold mb-3">14 ngày gần nhất</h2>
        <div className="flex gap-1.5 flex-wrap">
          {last14.map((d) => {
            const st = taskStatus(progress, allCards, d);
            const n = Object.values(st).filter(Boolean).length;
            const active = isActiveDay(progress.days[d]);
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div
                  className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-xs font-medium"
                  style={{
                    background: n ? `color-mix(in srgb, var(--ok) ${20 + n * 16}%, transparent)` : active ? "var(--ok-soft)" : undefined,
                  }}
                  title={`${d}: ${n}/5 nhiệm vụ`}
                >
                  {n || ""}
                </div>
                <span className="text-[10px] text-muted">{d.slice(8)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted">
          Gợi ý cho trình độ TOEIC 700 → IELTS 6.0: ưu tiên <b>Speaking</b> và <b>Writing</b> vì TOEIC không luyện 2 kỹ năng
          này. Cuối tuần viết 1 bài Task 2 hoàn chỉnh trong 40 phút.
        </p>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted mt-0.5">{hint}</div>}
    </Card>
  );
}
