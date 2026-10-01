"use client";

import { useEffect, useMemo, useState } from "react";
import { DICTATION } from "@/content/dictation";
import { diffWords } from "@/lib/diff";
import { DRILL_LABEL, checkDrill, makeDrill, type Drill, type DrillKind } from "@/lib/drills";
import { MATERIALS, type Material } from "@/lib/materials";
import { useProgress } from "@/lib/progress";
import { getVoices, speak } from "@/lib/speech";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DocViewer, useSignedUrl } from "@/components/DocViewer";
import { Button, Card, PageHeader } from "@/components/ui";

type Tab = "dictation" | "course" | "drills";

export default function ListeningPage() {
  const [tab, setTab] = useState<Tab>("dictation");
  const tabs: [Tab, string][] = [
    ["dictation", "✏️ Chép chính tả"],
    ["course", "🎧 Bài nghe khóa học"],
    ["drills", "🔢 Số & đánh vần"],
  ];
  return (
    <div>
      <PageHeader
        title="Listening"
        color="var(--listen)"
        subtitle="Mỗi ngày: chép chính tả 10 câu + nghe 1 bài của khóa học. Chép chính tả giúp bạn nghe ra từng từ thay vì chỉ đoán ý như khi làm TOEIC."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map(([k, label]) => (
          <Button key={k} variant={tab === k ? "primary" : "outline"} onClick={() => setTab(k)}>
            {label}
          </Button>
        ))}
        <VoicePicker />
      </div>
      {tab === "dictation" && <Dictation />}
      {tab === "course" && <CourseAudio />}
      {tab === "drills" && <Drills />}
    </div>
  );
}

function VoicePicker() {
  const { progress, update } = useProgress();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const load = () => setVoices(getVoices());
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);
  return (
    <div className="ml-auto flex items-center gap-2 text-sm">
      <select
        value={progress.settings.voice}
        onChange={(e) => update((p) => void (p.settings.voice = e.target.value))}
        className="max-w-52 rounded-lg border border-border bg-card px-2 py-1.5"
        title="Giọng đọc"
      >
        <option value="">Giọng mặc định (Anh-Anh)</option>
        {voices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      <select
        value={progress.settings.rate}
        onChange={(e) => update((p) => void (p.settings.rate = Number(e.target.value)))}
        className="rounded-lg border border-border bg-card px-2 py-1.5"
        title="Tốc độ đọc"
      >
        {[0.7, 0.8, 0.9, 1, 1.1].map((r) => (
          <option key={r} value={r}>
            {r}x
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- Chép chính tả ---------------- */

function Dictation() {
  const { progress, updateDay } = useProgress();
  const [setId, setSetId] = useState(DICTATION[0].id);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<ReturnType<typeof diffWords> | null>(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const set = DICTATION.find((s) => s.id === setId)!;
  const sentence = set.sentences[idx];
  const opts = { rate: progress.settings.rate, voice: progress.settings.voice };

  function check() {
    if (!typed.trim() || result) return;
    const r = diffWords(sentence, typed);
    const perfect = r.correct === r.total && r.tokens.every((t) => t.status === "ok");
    setResult(r);
    setSession((s) => ({ correct: s.correct + (perfect ? 1 : 0), total: s.total + 1 }));
    updateDay((d) => {
      d.dictationTotal += 1;
      if (perfect) d.dictationCorrect += 1;
    });
  }

  function next() {
    setIdx((i) => (i + 1) % set.sentences.length);
    setTyped("");
    setResult(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select
            value={setId}
            onChange={(e) => {
              setSetId(e.target.value);
              setIdx(0);
              setTyped("");
              setResult(null);
            }} className="rounded-lg border border-border bg-bg px-3 py-2">
            {DICTATION.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.level}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-muted">
            Câu {idx + 1}/{set.sentences.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => speak(sentence, opts)}>
            ▶ Nghe
          </Button>
          <Button variant="outline" onClick={() => speak(sentence, { ...opts, rate: 0.65 })}>
            🐢 Nghe chậm
          </Button>
        </div>
        <textarea
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (result) next();
              else check();
            }
          }}
          rows={3}
          placeholder="Gõ lại câu bạn nghe được… (Enter để kiểm tra, Enter lần nữa để sang câu tiếp)"
          className="mt-4 w-full rounded-lg border border-border bg-bg p-3"
        />
        {!result ? (
          <div className="mt-3 flex gap-2">
            <Button onClick={check} disabled={!typed.trim()}>
              Kiểm tra
            </Button>
            <Button variant="ghost" onClick={next}>
              Bỏ qua
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="rounded-lg bg-bg p-3 leading-loose">
              {result.tokens.map((t, i) => (
                <span
                  key={i}
                  className={`mr-1.5 rounded px-1 ${
                    t.status === "ok" ? "" : t.status === "missing" ? "bg-bad-soft text-bad font-semibold" : "text-muted line-through"
                  }`}
                >
                  {t.word}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm">
              Đúng <b>{result.correct}/{result.total}</b> từ.{" "}
              <span className="text-muted">
                <span className="text-bad font-semibold">Đỏ</span> = từ bị thiếu/sai, <span className="line-through">gạch</span> = từ thừa.
                Nghe lại và để ý những từ nối nhỏ (a, the, of, to) — người Việt hay bỏ sót.
              </span>
            </p>
            <Button className="mt-3" onClick={next}>
              Câu tiếp →
            </Button>
          </div>
        )}
      </Card>
      <Card className="text-sm">
        <div className="font-semibold">Phiên này</div>
        <div className="mt-1 text-2xl font-bold text-listen">
          {session.correct}/{session.total}
        </div>
        <div className="text-muted">câu đúng hoàn toàn</div>
        <div className="mt-4 font-semibold">Cách luyện</div>
        <ol className="mt-1 list-decimal pl-4 space-y-1 text-muted">
          <li>Nghe 1–2 lần, không nhìn chữ.</li>
          <li>Gõ lại toàn bộ câu.</li>
          <li>Kiểm tra, xem từ đỏ.</li>
          <li>Nghe lại và <b>nói to</b> câu đó (shadowing) 2 lần.</li>
        </ol>
      </Card>
    </div>
  );
}

/* ---------------- Bài nghe khóa học ---------------- */

function CourseAudio() {
  const { progress, update, updateDay } = useProgress();
  const [current, setCurrent] = useState<string | null>(null);
  const [showDoc, setShowDoc] = useState<string | null>(null);

  const byWeek = useMemo(() => {
    const m = new Map<number | null, Material[]>();
    for (const x of MATERIALS) if (x.kind === "audio") m.set(x.week, [...(m.get(x.week) || []), x]);
    return [...m.entries()];
  }, []);

  // Đề bài đi kèm: tài liệu Listening cùng tuần hoặc cùng thư mục với file mp3
  const related = (audio?: Material) =>
    MATERIALS.filter((m) => audio && m.week === audio.week && m.kind !== "audio" && (m.skill === "listening" || m.dir === audio.dir));
  const currentMat = MATERIALS.find((m) => m.path === current);
  const relatedDocs = related(currentMat);
  const shownDoc = relatedDocs.find((d) => d.path === showDoc);

  if (!byWeek.length) return <Card>Không tìm thấy file mp3 trong thư mục tài liệu.</Card>;

  const state = current ? progress.listening[current] : undefined;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="lg:max-h-[80vh] lg:overflow-y-auto p-3">
        {byWeek.map(([week, list]) => (
          <div key={String(week)} className="mb-3">
            <div className="px-2 py-1 text-xs font-semibold uppercase text-muted">{week ? `Tuần ${week}` : "Khác"}</div>
            {list.map((m) => (
              <button
                key={m.path}
                onClick={() => {
                  setCurrent(m.path);
                  setShowDoc(related(m)[0]?.path ?? null);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                  current === m.path ? "bg-accent-soft text-listen font-semibold" : "hover:bg-bg"
                }`}
              >
                <span>{progress.listening[m.path]?.done ? "✅" : "🎵"}</span>
                <span className="truncate">{m.name.replace(/\.(mp3|m4a)$/i, "")}</span>
              </button>
            ))}
          </div>
        ))}
      </Card>
      <div className="space-y-4 min-w-0">
        {!currentMat ? (
          <Card className="text-muted">← Chọn một bài nghe. Đề bài (file Homework Listening cùng tuần) sẽ hiện ngay bên dưới.</Card>
        ) : (
          <>
            <Card>
              <div className="mb-3 font-semibold">{currentMat.name}</div>
              <SignedAudio key={currentMat.key} file={currentMat} />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!state?.done}
                    onChange={(e) => {
                      const done = e.target.checked;
                      update((p) => void (p.listening[currentMat.path] = { notes: p.listening[currentMat.path]?.notes || "", done }));
                      if (done) updateDay((d) => void (!d.listeningAudio.includes(currentMat.path) && d.listeningAudio.push(currentMat.path)));
                    }}
                  />
                  Đã nghe xong bài này
                </label>
                <span className="text-xs text-muted">Phím tắt: Space phát/dừng · ← → tua 5 giây</span>
              </div>
              <textarea
                value={state?.notes || ""}
                onChange={(e) =>
                  update((p) => void (p.listening[currentMat.path] = { done: !!p.listening[currentMat.path]?.done, notes: e.target.value }))
                }
                rows={3}
                placeholder="Ghi đáp án / từ mới nghe được…"
                className="mt-3 w-full rounded-lg border border-border bg-bg p-3 text-sm"
              />
            </Card>
            {relatedDocs.length > 0 && (
              <Card>
                <div className="mb-3 flex flex-wrap gap-2">
                  {relatedDocs.map((d) => (
                    <button
                      key={d.path}
                      onClick={() => setShowDoc(d.path)}
                      className={`rounded-lg border px-3 py-1 text-sm ${showDoc === d.path ? "border-listen text-listen" : "border-border"}`}
                    >
                      📄 {d.name}
                    </button>
                  ))}
                </div>
                {shownDoc && <DocViewer key={shownDoc.key} file={shownDoc} />}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Số & đánh vần ---------------- */

function Drills() {
  const { progress, updateDay } = useProgress();
  const [kind, setKind] = useState<DrillKind | "mix">("mix");
  const [drill, setDrill] = useState<Drill | null>(null);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const opts = { rate: progress.settings.rate, voice: progress.settings.voice };

  function newDrill() {
    const kinds = Object.keys(DRILL_LABEL) as DrillKind[];
    const d = makeDrill(kind === "mix" ? kinds[Math.floor(Math.random() * kinds.length)] : kind);
    setDrill(d);
    setInput("");
    setChecked(null);
    speak(d.speech, opts);
  }

  function check() {
    if (!drill || checked !== null || !input.trim()) return;
    const ok = checkDrill(drill, input);
    setChecked(ok);
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    updateDay((d) => void (d.drills += 1));
  }

  return (
    <Card className="max-w-2xl">
      <p className="text-sm text-muted mb-4">
        Section 1 của IELTS luôn có số điện thoại, ngày tháng, giá tiền, tên được đánh vần. Sai một chữ là mất điểm cả câu. Nghe và gõ lại thật chính xác.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["mix", ...Object.keys(DRILL_LABEL)] as (DrillKind | "mix")[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-full border px-3 py-1 text-sm ${kind === k ? "border-listen bg-accent-soft text-listen" : "border-border"}`}
          >
            {k === "mix" ? "Trộn tất cả" : DRILL_LABEL[k]}
          </button>
        ))}
      </div>
      {!drill ? (
        <Button onClick={newDrill}>▶ Bắt đầu</Button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => speak(drill.speech, opts)}>
              🔊 Nghe lại
            </Button>
            <span className="text-sm text-muted">{DRILL_LABEL[drill.kind]}</span>
            <span className="ml-auto text-sm">
              Đúng {score.ok}/{score.total}
            </span>
          </div>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (checked === null) check();
                else newDrill();
              }
            }}
            placeholder={drill.hint}
            className={`mt-3 w-full rounded-lg border-2 bg-bg px-3 py-2 text-lg font-mono ${
              checked === null ? "border-border" : checked ? "border-ok" : "border-bad"
            }`}
          />
          <p className="mt-1 text-xs text-muted">{drill.hint}</p>
          {checked !== null && (
            <div className={`mt-3 rounded-lg p-3 text-sm ${checked ? "bg-ok-soft" : "bg-bad-soft"}`}>
              {checked ? "✓ Chính xác!" : <>✗ Đáp án: <b className="font-mono">{drill.answer}</b></>}
              <div className="text-muted mt-1">Câu đọc: “{drill.speech}”</div>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {checked === null ? (
              <Button onClick={check} disabled={!input.trim()}>
                Kiểm tra
              </Button>
            ) : (
              <Button onClick={newDrill}>Câu tiếp (Enter) →</Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

function SignedAudio({ file }: { file: Material }) {
  const { url, error } = useSignedUrl(file.key);
  if (error) return <p className="text-bad text-sm">Không tải được audio. Đã chạy “npm run upload” chưa?</p>;
  if (!url) return <p className="text-muted text-sm">Đang tải audio…</p>;
  return <AudioPlayer src={url} />;
}
