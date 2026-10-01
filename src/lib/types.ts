export type VocabCard = {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  topic: string;
  week: number | null;
  source: "vocab-list" | "reading" | "custom" | "ielts-topic";
  pos?: string;
};

export type CardState = { due: string; interval: number; ease: number; reps: number; lapses: number; last?: string };

export type TaskKey = "vocab" | "reading" | "listening" | "writing" | "speaking";

export type DayLog = {
  vocabReviewed: number;
  newLearned: number;
  readingDone: string[];
  dictationCorrect: number;
  dictationTotal: number;
  drills: number;
  listeningAudio: string[];
  manual: Partial<Record<TaskKey, boolean>>;
};

export type ReadingAttempt = { date: string; score: number; total: number; seconds: number };

export type EssayKind = "task1" | "task2" | "readwrite";
/** kind không có = task2 (bài lưu trước khi tách mục) */
export type Essay = { id: string; kind?: EssayKind; promptId: string; prompt: string; text: string; words: number; seconds: number; date: string };

/** newTopics: các chủ đề được chọn để học thẻ mới (rỗng = tất cả) */
export type Settings = { newPerDay: number; rate: number; voice: string; newTopics: string[] };

export type Progress = {
  version: 1;
  cards: Record<string, CardState>;
  customCards: VocabCard[];
  days: Record<string, DayLog>;
  reading: Record<string, ReadingAttempt[]>;
  listening: Record<string, { done: boolean; notes: string }>;
  essays: Essay[];
  settings: Settings;
};

export const emptyProgress = (): Progress => ({
  version: 1,
  cards: {},
  customCards: [],
  days: {},
  reading: {},
  listening: {},
  essays: [],
  settings: { newPerDay: 10, rate: 0.9, voice: "", newTopics: [] },
});

export const emptyDay = (): DayLog => ({
  vocabReviewed: 0,
  newLearned: 0,
  readingDone: [],
  dictationCorrect: 0,
  dictationTotal: 0,
  drills: 0,
  listeningAudio: [],
  manual: {},
});

/** Nhóm bộ thẻ để hiển thị: chủ đề IELTS, khóa L5.5 hay từ tự lưu. */
export const deckOf = (c: VocabCard) =>
  c.source === "ielts-topic" ? "Chủ đề IELTS" : c.source === "custom" ? "Từ tôi lưu" : "Khóa L5.5";
