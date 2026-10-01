"use client";

import { useEffect, useMemo, useState } from "react";
import { today } from "@/lib/date";
import { dueCards, newCardsLeft, useProgress } from "@/lib/progress";
import { isMature, schedule, type Grade } from "@/lib/srs";
import { speak } from "@/lib/speech";
import { deckOf, type VocabCard } from "@/lib/types";
import { Button, Card, PageHeader, Pill } from "@/components/ui";

type Tab = "review" | "topics" | "list";

export default function VocabPage() {
  const [tab, setTab] = useState<Tab>("review");
  const [listTopic, setListTopic] = useState("all");
  const tabs: [Tab, string][] = [
    ["review", "Ôn tập hôm nay"],
    ["topics", "Chủ đề"],
    ["list", "Danh sách từ"],
  ];
  return (
    <div>
      <PageHeader
        title="Từ vựng"
        color="var(--vocab)"
        subtitle="Hơn 800 từ theo 22 chủ đề IELTS và Vocab List của khóa L5.5. Thẻ nào nhớ tốt sẽ cách ngày lâu hơn mới ôn lại, thẻ nào quên sẽ ôn lại sớm."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map(([k, label]) => (
          <Button key={k} variant={tab === k ? "primary" : "outline"} onClick={() => setTab(k)}>
            {label}
          </Button>
        ))}
      </div>
      {tab === "review" && <Review onPickTopics={() => setTab("topics")} />}
      {tab === "topics" && (
        <Topics
          onOpen={(t) => {
            setListTopic(t);
            setTab("list");
          }}
        />
      )}
      {tab === "list" && <WordList topic={listTopic} setTopic={setListTopic} />}
    </div>
  );
}

/** Danh sách chủ đề, nhóm theo bộ thẻ. */
function useTopicGroups() {
  const { allCards } = useProgress();
  return useMemo(() => {
    const groups = new Map<string, Map<string, VocabCard[]>>();
    for (const c of allCards) {
      const deck = deckOf(c);
      if (!groups.has(deck)) groups.set(deck, new Map());
      const g = groups.get(deck)!;
      g.set(c.topic, [...(g.get(c.topic) || []), c]);
    }
    return [...groups.entries()].map(([deck, topics]) => ({ deck, topics: [...topics.entries()] }));
  }, [allCards]);
}

function Topics({ onOpen }: { onOpen: (topic: string) => void }) {
  const { progress, update } = useProgress();
  const groups = useTopicGroups();
  const selected = progress.settings.newTopics;

  const toggle = (topic: string) =>
    update((p) => {
      const cur = p.settings.newTopics;
      p.settings.newTopics = cur.includes(topic) ? cur.filter((t) => t !== topic) : [...cur, topic];
    });

  return (
    <div className="space-y-6">
      <Card className="text-sm">
        Tick ✓ các chủ đề bạn muốn <b>học thẻ mới</b> (ví dụ chủ đề của đề Speaking/Writing tuần này). Không tick chủ đề nào = học lần
        lượt tất cả. Thẻ đã học vẫn được ôn lại đúng hạn dù thuộc chủ đề nào.
        {selected.length > 0 && (
          <button className="ml-2 text-accent underline" onClick={() => update((p) => void (p.settings.newTopics = []))}>
            Bỏ chọn tất cả ({selected.length})
          </button>
        )}
      </Card>
      {groups.map(({ deck, topics }) => (
        <section key={deck}>
          <h2 className="mb-3 font-semibold">{deck}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map(([topic, cards]) => {
              const learned = cards.filter((c) => progress.cards[c.id]).length;
              const mature = cards.filter((c) => isMature(progress.cards[c.id])).length;
              const on = selected.includes(topic);
              return (
                <Card key={topic} className={`p-4 ${on ? "border-vocab" : ""}`}>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" checked={on} onChange={() => toggle(topic)} className="mt-1" title="Học thẻ mới từ chủ đề này" />
                    <button className="flex-1 text-left font-medium hover:text-vocab" onClick={() => onOpen(topic)}>
                      {topic}
                    </button>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-bg overflow-hidden">
                    <div className="h-full bg-vocab" style={{ width: `${(learned / cards.length) * 100}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs text-muted">
                    <span>
                      Đã học {learned}/{cards.length} · thuộc {mature}
                    </span>
                    <button className="hover:text-vocab" onClick={() => onOpen(topic)}>
                      Xem từ →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Review({ onPickTopics }: { onPickTopics: () => void }) {
  const { loaded } = useProgress();
  const [session, setSession] = useState(0);
  if (!loaded) return <Card>Đang tải…</Card>;
  return <ReviewSession key={session} onRestart={() => setSession((s) => s + 1)} onPickTopics={onPickTopics} />;
}

function ReviewSession({ onRestart, onPickTopics }: { onRestart: () => void; onPickTopics: () => void }) {
  const { progress, allCards, update, updateDay } = useProgress();
  // Hàng đợi tạo 1 lần cho mỗi buổi ôn: thẻ đến hạn trước, rồi thẻ mới
  const [queue, setQueue] = useState<VocabCard[]>(() => [...dueCards(progress, allCards), ...newCardsLeft(progress, allCards)]);
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [typing, setTyping] = useState("");

  const card = queue[0];
  const state = card ? progress.cards[card.id] : undefined;

  useEffect(() => {
    if (card) speak(card.word, { rate: progress.settings.rate, voice: progress.settings.voice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card || (e.target as HTMLElement).tagName === "INPUT") return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ["1", "2", "3", "4"].includes(e.key)) grade((Number(e.key) - 1) as Grade);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function grade(g: Grade) {
    if (!card) return;
    const isNew = !progress.cards[card.id];
    const next = schedule(progress.cards[card.id], g, today());
    update((p) => void (p.cards[card.id] = next));
    updateDay((d) => {
      d.vocabReviewed += 1;
      if (isNew) d.newLearned += 1;
    });
    const rest = queue.slice(1);
    // Quên thì đưa thẻ về cuối hàng để ôn lại trong buổi này
    setQueue(g === 0 ? [...rest, card] : rest);
    setDoneCount((n) => n + 1);
    setRevealed(false);
    setTyping("");
  }

  if (!card)
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-semibold">Hết thẻ cần ôn hôm nay!</p>
        <p className="text-muted text-sm mt-1">
          Đã ôn {doneCount} lượt. Ngày mai quay lại nhé. Muốn học thêm thì tăng số thẻ mới/ngày bên dưới.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <NewPerDay onChange={onRestart} />
          <button className="text-sm text-vocab underline" onClick={onPickTopics}>
            Chọn chủ đề khác để học
          </button>
        </div>
      </Card>
    );

  const typedOk = typing.trim().toLowerCase() === card.word.toLowerCase();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <Card className="min-h-[340px] flex flex-col items-center text-center">
        <div className="self-stretch flex justify-between text-xs text-muted">
          <span>{state ? "Ôn lại" : "Thẻ mới"}</span>
          <span>Còn {queue.length} thẻ</span>
        </div>
        <div className="mt-6 text-3xl font-bold">{card.word}</div>
        <div className="mt-1 text-muted">
          {card.ipa} {card.pos && <i>({card.pos})</i>}
        </div>
        <Button variant="ghost" className="mt-2" onClick={() => speak(card.word, progress.settings)}>
          🔊 Nghe
        </Button>

        {!revealed ? (
          <div className="mt-auto pt-6 w-full max-w-sm">
            <p className="text-sm text-muted mb-2">Nhớ nghĩa của từ này không? Thử nói to một câu có dùng từ này.</p>
            <Button className="w-full" onClick={() => setRevealed(true)}>
              Xem nghĩa (Space)
            </Button>
          </div>
        ) : (
          <div className="mt-4 w-full max-w-lg">
            <div className="text-xl font-semibold text-vocab">{card.meaning}</div>
            {card.example && (
              <p className="mt-3 italic cursor-pointer" onClick={() => speak(card.example, progress.settings)} title="Bấm để nghe">
                “{card.example}” 🔊
              </p>
            )}
            <div className="mt-4">
              <input
                value={typing}
                onChange={(e) => setTyping(e.target.value)}
                placeholder="Gõ lại từ để nhớ chính tả (không bắt buộc)"
                className={`w-full rounded-lg border px-3 py-2 bg-bg text-center ${
                  typing ? (typedOk ? "border-ok" : "border-bad") : "border-border"
                }`}
              />
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              <GradeBtn label="Quên" hint="1" color="var(--bad)" onClick={() => grade(0)} />
              <GradeBtn label="Khó" hint="2" color="var(--warn)" onClick={() => grade(1)} />
              <GradeBtn label="Nhớ" hint="3" color="var(--ok)" onClick={() => grade(2)} />
              <GradeBtn label="Dễ" hint="4" color="var(--accent)" onClick={() => grade(3)} />
            </div>
          </div>
        )}
      </Card>
      <Card className="text-sm">
        <div className="font-semibold mb-2">Thông tin thẻ</div>
        <div className="space-y-1 text-muted">
          <div>Chủ đề: {card.topic}</div>
          {card.week && <div>Tuần {card.week}</div>}
          {state && (
            <>
              <div>Khoảng ôn: {state.interval} ngày</div>
              <div>Số lần quên: {state.lapses}</div>
            </>
          )}
        </div>
        <div className="mt-4 font-semibold mb-1">Phím tắt</div>
        <div className="text-muted">Space: xem nghĩa · 1–4: chấm</div>
        <div className="mt-4">
          <NewPerDay onChange={() => {}} />
        </div>
        <div className="mt-3 text-muted">
          Thẻ mới lấy từ:{" "}
          <b className="text-text">
            {progress.settings.newTopics.length ? `${progress.settings.newTopics.length} chủ đề đã chọn` : "tất cả chủ đề"}
          </b>{" "}
          <button className="text-vocab underline" onClick={onPickTopics}>
            Đổi
          </button>
        </div>
      </Card>
    </div>
  );
}

function GradeBtn({ label, hint, color, onClick }: { label: string; hint: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border-2 py-2 text-sm font-semibold hover:opacity-80"
      style={{ borderColor: color, color }}
    >
      {label}
      <span className="block text-[10px] font-normal opacity-70">phím {hint}</span>
    </button>
  );
}

function NewPerDay({ onChange }: { onChange: () => void }) {
  const { progress, update } = useProgress();
  return (
    <label className="text-sm flex items-center gap-2">
      Thẻ mới/ngày
      <select
        className="rounded border border-border bg-bg px-2 py-1"
        value={progress.settings.newPerDay}
        onChange={(e) => {
          update((p) => void (p.settings.newPerDay = Number(e.target.value)));
          onChange();
        }}
      >
        {[5, 10, 15, 20, 30].map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>
    </label>
  );
}

function WordList({ topic, setTopic }: { topic: string; setTopic: (t: string) => void }) {
  const { progress, allCards } = useProgress();
  const [q, setQ] = useState("");
  const groups = useTopicGroups();
  const list = allCards.filter(
    (c) =>
      (topic === "all" || c.topic === topic) &&
      (!q || c.word.toLowerCase().includes(q.toLowerCase()) || c.meaning.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Card>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm từ hoặc nghĩa…"
          className="flex-1 min-w-48 rounded-lg border border-border bg-bg px-3 py-2"
        />
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-lg border border-border bg-bg px-3 py-2">
          <option value="all">Tất cả chủ đề ({allCards.length})</option>
          {groups.map(({ deck, topics }) => (
            <optgroup key={deck} label={deck}>
              {topics.map(([t, cards]) => (
                <option key={t} value={t}>
                  {t} ({cards.length})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-3">Từ</th>
              <th className="py-2 pr-3">Nghĩa</th>
              <th className="py-2 pr-3 hidden md:table-cell">Ví dụ</th>
              <th className="py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const s = progress.cards[c.id];
              return (
                <tr key={c.id} className="border-b border-border align-top">
                  <td className="py-2 pr-3">
                    <button className="font-medium text-left hover:text-vocab" onClick={() => speak(c.word, progress.settings)}>
                      {c.word} 🔊
                    </button>
                    <div className="text-xs text-muted">{c.ipa}</div>
                  </td>
                  <td className="py-2 pr-3">{c.meaning}</td>
                  <td className="py-2 pr-3 hidden md:table-cell text-muted italic">{c.example}</td>
                  <td className="py-2 whitespace-nowrap">
                    {!s ? <Pill>Chưa học</Pill> : isMature(s) ? <Pill color="var(--ok)">Đã thuộc</Pill> : <Pill color="var(--warn)">Đang học</Pill>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
