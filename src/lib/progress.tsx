"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import vocabData from "@/content/vocab.json";
import { TOPIC_CARDS } from "@/content/vocab-topics";
import { addDays, today } from "./date";
import { supabase } from "./supabase";
import { emptyDay, emptyProgress, type DayLog, type Progress, type TaskKey, type VocabCard } from "./types";

type Ctx = {
  progress: Progress;
  loaded: boolean;
  update: (fn: (p: Progress) => void) => void;
  updateDay: (fn: (d: DayLog) => void) => void;
  allCards: VocabCard[];
  saveError: boolean;
};

const ProgressContext = createContext<Ctx | null>(null);

/** Tiến độ của mỗi tài khoản lưu ở 1 dòng trong bảng `progress` trên Supabase. */
export function ProgressProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Progress | null>(null);

  useEffect(() => {
    supabase
      .from("progress")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        const saved = data?.data as Progress | undefined;
        if (saved) setProgress({ ...emptyProgress(), ...saved, settings: { ...emptyProgress().settings, ...saved.settings } });
        setLoaded(true);
      });
  }, [userId]);

  const flush = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const data = pending.current;
    if (!data) return;
    pending.current = null;
    const { error } = await supabase.from("progress").upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
    setSaveError(!!error);
  }, [userId]);

  // Lưu ngay khi chuyển tab / đóng trang để không mất tiến độ
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

  const update = useCallback(
    (fn: (p: Progress) => void) => {
      setProgress((prev) => {
        const next: Progress = structuredClone(prev);
        fn(next);
        pending.current = next;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(flush, 800);
        return next;
      });
    },
    [flush],
  );

  const updateDay = useCallback(
    (fn: (d: DayLog) => void) =>
      update((p) => {
        const key = today();
        p.days[key] = { ...emptyDay(), ...p.days[key] };
        fn(p.days[key]);
      }),
    [update],
  );

  const allCards = [...TOPIC_CARDS, ...(vocabData as VocabCard[]), ...progress.customCards];

  return (
    <ProgressContext.Provider value={{ progress, loaded, update, updateDay, allCards, saveError }}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export function dueCards(p: Progress, cards: VocabCard[], date = today()) {
  return cards.filter((c) => p.cards[c.id] && p.cards[c.id].due <= date);
}

export function newCardsLeft(p: Progress, cards: VocabCard[], date = today()) {
  const learnedToday = p.days[date]?.newLearned ?? 0;
  const quota = Math.max(0, p.settings.newPerDay - learnedToday);
  const topics = p.settings.newTopics;
  return cards.filter((c) => !p.cards[c.id] && (!topics.length || topics.includes(c.topic))).slice(0, quota);
}

/** Trạng thái hoàn thành từng nhiệm vụ trong ngày. */
export function taskStatus(p: Progress, cards: VocabCard[], date = today()): Record<TaskKey, boolean> {
  const d = { ...emptyDay(), ...p.days[date] };
  const vocabDone =
    d.vocabReviewed >= 30 || (d.vocabReviewed > 0 && dueCards(p, cards, date).length === 0 && newCardsLeft(p, cards, date).length === 0);
  return {
    vocab: !!d.manual.vocab || vocabDone,
    reading: !!d.manual.reading || d.readingDone.length > 0,
    listening: !!d.manual.listening || d.dictationTotal >= 10 || d.listeningAudio.length > 0 || d.drills >= 10,
    writing: !!d.manual.writing,
    speaking: !!d.manual.speaking,
  };
}

export function isActiveDay(d?: DayLog) {
  if (!d) return false;
  return (
    d.vocabReviewed > 0 ||
    d.readingDone.length > 0 ||
    d.dictationTotal > 0 ||
    d.drills > 0 ||
    d.listeningAudio.length > 0 ||
    Object.values(d.manual).some(Boolean)
  );
}

export function streak(p: Progress, date = today()) {
  let n = 0;
  let cur = isActiveDay(p.days[date]) ? date : addDays(date, -1);
  while (isActiveDay(p.days[cur])) {
    n++;
    cur = addDays(cur, -1);
  }
  return n;
}
