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

/** Kết quả AI chấm bài. Band chỉ là ước lượng tham khảo, không phải điểm thi thật. */
export type AiGrade = {
  band: number;
  criteria: { name: string; band: number; comment: string }[];
  strengths: string[];
  issues: { quote: string; problem: string; fix: string }[];
  upgrades: { from: string; to: string }[];
  nextSteps: string[];
  model: string;
  date: string;
};

/** kind không có = task2 (bài lưu trước khi tách mục) */
export type Essay = { id: string; kind?: EssayKind; promptId: string; prompt: string; text: string; words: number; seconds: number; date: string; grade?: AiGrade };

/** Một lần luyện nói được chép lời và chấm. */
export type SpeakingAttempt = { id: string; part: "p1" | "p2" | "p3"; question: string; transcript: string; seconds: number; date: string; grade?: AiGrade };

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
  speaking?: SpeakingAttempt[];
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
