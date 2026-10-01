import { addDays } from "./date";
import type { CardState } from "./types";

// 0 = Quên, 1 = Khó, 2 = Nhớ, 3 = Dễ  (biến thể đơn giản của thuật toán SM-2 mà Anki dùng)
export type Grade = 0 | 1 | 2 | 3;

export function schedule(prev: CardState | undefined, grade: Grade, now: string): CardState {
  const s: CardState = prev ? { ...prev } : { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
  if (grade === 0) {
    if (s.reps > 0) s.lapses += 1;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.interval = 0;
    s.reps = 0;
  } else if (s.reps === 0) {
    s.interval = grade === 3 ? 4 : grade === 2 ? 1 : 1;
    s.reps = 1;
    if (grade === 1) s.ease = Math.max(1.3, s.ease - 0.15);
  } else {
    if (grade === 1) {
      s.interval = Math.max(1, Math.round(s.interval * 1.2));
      s.ease = Math.max(1.3, s.ease - 0.15);
    } else if (grade === 2) {
      s.interval = s.reps === 1 ? 3 : Math.max(s.interval + 1, Math.round(s.interval * s.ease));
    } else {
      s.interval = Math.max(s.interval + 2, Math.round(s.interval * s.ease * 1.3));
      s.ease += 0.15;
    }
    s.reps += 1;
  }
  s.due = addDays(now, s.interval);
  s.last = now;
  return s;
}

/** Một thẻ coi như "đã thuộc" khi khoảng ôn từ 21 ngày trở lên. */
export const isMature = (s?: CardState) => !!s && s.interval >= 21;
