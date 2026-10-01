"use client";

import { useEffect, useRef, useState } from "react";

const SPEEDS = [0.75, 0.85, 1, 1.1, 1.25];
const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/** Trình phát audio cho luyện nghe: tua 5 giây, đổi tốc độ, lặp đoạn A–B. Đổi bài thì truyền key={src} để reset. */
export function AudioPlayer({ src, onEnded }: { src: string; onEnded?: () => void }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = speed;
  }, [speed]);

  const seek = (delta: number) => {
    const a = ref.current;
    if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta));
  };

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  // Phím tắt khi không gõ chữ: Space phát/dừng, ← → tua 5 giây
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowLeft") seek(-5);
      else if (e.key === "ArrowRight") seek(5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onTime() {
    const a = ref.current;
    if (!a) return;
    if (loopA !== null && loopB !== null && a.currentTime >= loopB) a.currentTime = loopA;
    setTime(a.currentTime);
  }

  function abButton() {
    const t = ref.current?.currentTime ?? 0;
    if (loopA === null) setLoopA(t);
    else if (loopB === null && t > loopA) setLoopB(t);
    else {
      setLoopA(null);
      setLoopB(null);
    }
  }

  const btn = "rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-bg";

  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={onTime}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
      />
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs w-10 text-right">{fmt(time)}</span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              if (ref.current) ref.current.currentTime = Number(e.target.value);
            }}
            className="w-full accent-[var(--listen)]"
          />
          {loopA !== null && duration > 0 && (
            <div
              className="pointer-events-none absolute top-0 h-1.5 rounded bg-listen opacity-40"
              style={{
                left: `${(loopA / duration) * 100}%`,
                width: `${(((loopB ?? time) - loopA) / duration) * 100}%`,
              }}
            />
          )}
        </div>
        <span className="font-mono text-xs w-10">{fmt(duration)}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className={btn} onClick={() => seek(-5)} title="Phím ←">
          ⏪ 5s
        </button>
        <button className="rounded-lg bg-listen px-5 py-1.5 text-sm font-semibold text-white" onClick={toggle} title="Phím Space">
          {playing ? "⏸ Dừng" : "▶ Phát"}
        </button>
        <button className={btn} onClick={() => seek(5)} title="Phím →">
          5s ⏩
        </button>
        <button
          className={`${btn} ${loopA !== null ? "border-listen text-listen" : ""}`}
          onClick={abButton}
          title="Bấm lần 1 đặt điểm A, lần 2 đặt điểm B để nghe lặp, lần 3 để bỏ lặp"
        >
          🔁 {loopA === null ? "Lặp A–B" : loopB === null ? `A=${fmt(loopA)} → đặt B` : `${fmt(loopA)}–${fmt(loopB)} ✕`}
        </button>
        <div className="ml-auto flex gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded px-2 py-1 text-xs ${speed === s ? "bg-listen text-white" : "hover:bg-card"}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
