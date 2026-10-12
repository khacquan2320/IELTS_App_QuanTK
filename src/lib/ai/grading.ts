// CHỈ chạy phía server. Prompt chấm bài + chuẩn hoá kết quả AI trả về.
import type { AiGrade } from "../types";

const OUTPUT_SHAPE = `Return ONLY a JSON object with exactly this shape:
{
  "band": number,                       // overall, 0-9 in steps of 0.5
  "criteria": [ { "name": string, "band": number, "comment": string } ],   // exactly the 4 criteria listed above, in order
  "strengths": [string],                // 2-4 items
  "issues": [ { "quote": string, "problem": string, "fix": string } ],     // 3-6 most important errors; "quote" is copied EXACTLY from the learner's text, "fix" is the corrected English
  "upgrades": [ { "from": string, "to": string } ],                        // 3-5 vocabulary/phrase upgrades, "from" copied from the text
  "nextSteps": [string]                 // 2-3 concrete things to practise next
}
Write "comment", "strengths", "problem" and "nextSteps" in simple VIETNAMESE (the learner is Vietnamese, around TOEIC 700). Keep "quote", "fix", "from" and "to" in English.`;

const LEARNER = `The learner is a Vietnamese adult (about TOEIC 700) aiming for IELTS band 6.0-6.5. Be honest and conservative: do not inflate the band. Judge against the official IELTS band descriptors. Be specific and encouraging, not vague.`;

export type WritingInput = { kind: "task1" | "task2"; prompt: string; context?: string; text: string; seconds: number };

export function writingPrompt(i: WritingInput) {
  const task1 = i.kind === "task1";
  const words = i.text.trim().split(/\s+/).filter(Boolean).length;
  const need = task1 ? 150 : 250;
  const criteria = task1
    ? "1. Task Achievement  2. Coherence and Cohesion  3. Lexical Resource  4. Grammatical Range and Accuracy"
    : "1. Task Response  2. Coherence and Cohesion  3. Lexical Resource  4. Grammatical Range and Accuracy";
  const system = `You are a strict but supportive IELTS Writing examiner.\n${LEARNER}\n\nAssess the answer to IELTS Academic Writing ${task1 ? "Task 1 (describe a chart)" : "Task 2 (essay)"} on four criteria, in this order: ${criteria}.\nThe band for each criterion is a whole or half band. The overall band is the average of the four, rounded to the nearest 0.5.\nA response under ${need} words must lose marks on ${task1 ? "Task Achievement" : "Task Response"}.${task1 ? "\nCheck that figures are reported accurately against the data given, and that there is a clear overview." : "\nCheck that every part of the question is answered and the position is clear throughout."}\n\n${OUTPUT_SHAPE}`;
  const user = `TASK PROMPT:\n${i.prompt}\n${i.context ? `\nCHART DATA (the learner could see this chart):\n${i.context}\n` : ""}\nLEARNER ANSWER (${words} words, written in ${Math.round(i.seconds / 60)} minutes):\n"""\n${i.text}\n"""`;
  return { system, user };
}

export type SpeakingInput = { part: "p1" | "p2" | "p3"; question: string; transcript: string; seconds: number };

export function speakingPrompt(i: SpeakingInput) {
  const words = i.transcript.trim().split(/\s+/).filter(Boolean).length;
  const partName = { p1: "Part 1 (short answers)", p2: "Part 2 (long turn, 1-2 minutes)", p3: "Part 3 (abstract discussion)" }[i.part];
  const system = `You are a strict but supportive IELTS Speaking examiner.\n${LEARNER}\n\nYou only have an automatic speech-to-text TRANSCRIPT of IELTS Speaking ${partName}, not the audio. The transcript has no reliable punctuation and may contain recognition errors: do not penalise missing punctuation or words that look like recogniser mistakes. You CANNOT judge pronunciation, so do not score it.\nAssess on these three criteria, in this order: 1. Fluency and Coherence (length of answer, development, linking, hesitation/repetition visible in text)  2. Lexical Resource  3. Grammatical Range and Accuracy.\nThe overall band is the average of the three, rounded to the nearest 0.5. Use "criteria" with exactly these 3 items. Mention in one "nextSteps" item that pronunciation was not assessed.\n${i.part === "p1" ? "Part 1 answers should be roughly 2-4 sentences with a reason or example." : i.part === "p2" ? "Part 2 should fill 1-2 minutes with a clear structure covering all cue-card points." : "Part 3 answers should give opinions with reasons, comparisons or examples."}\n\n${OUTPUT_SHAPE.replace("exactly the 4 criteria", "exactly the 3 criteria")}`;
  const user = `QUESTION / CUE CARD:\n${i.question}\n\nTRANSCRIPT (${words} words, spoken in about ${Math.round(i.seconds)} seconds):\n"""\n${i.transcript}\n"""`;
  return { system, user };
}

const half = (n: unknown) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(9, Math.max(0, Math.round(v * 2) / 2)) : 0;
};
const str = (s: unknown) => (typeof s === "string" ? s.trim() : "");
const strs = (a: unknown, max: number) => (Array.isArray(a) ? a.map(str).filter(Boolean).slice(0, max) : []);
const objs = <T,>(a: unknown, pick: (o: Record<string, unknown>) => T | null, max: number) =>
  (Array.isArray(a) ? a : [])
    .map((o) => (o && typeof o === "object" ? pick(o as Record<string, unknown>) : null))
    .filter((x): x is T => !!x)
    .slice(0, max);

/** Kiểm tra & làm sạch JSON AI trả về; ném lỗi nếu thiếu phần cốt lõi. */
export function normalizeGrade(raw: unknown, model: string, date: string, criteriaCount: number): AiGrade {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const criteria = objs(
    r.criteria,
    (o) => (str(o.name) ? { name: str(o.name), band: half(o.band), comment: str(o.comment) } : null),
    criteriaCount,
  );
  if (criteria.length < criteriaCount) throw new Error("incomplete");
  const avg = criteria.reduce((s, c) => s + c.band, 0) / criteria.length;
  return {
    band: half(r.band) || half(avg),
    criteria,
    strengths: strs(r.strengths, 5),
    issues: objs(r.issues, (o) => (str(o.problem) ? { quote: str(o.quote), problem: str(o.problem), fix: str(o.fix) } : null), 8),
    upgrades: objs(r.upgrades, (o) => (str(o.from) && str(o.to) ? { from: str(o.from), to: str(o.to) } : null), 6),
    nextSteps: strs(r.nextSteps, 4),
    model,
    date,
  };
}
