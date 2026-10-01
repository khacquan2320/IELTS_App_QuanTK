"use client";

import { useState } from "react";
import { ESSAY_GUIDE, PROMPTS, SELF_CHECK, type EssayType } from "@/content/writing";
import { Button, Card, Pill } from "../ui";
import { EssayEditor } from "./EssayEditor";
import { EssayHistory } from "./EssayHistory";

export function Task2Practice() {
  const [topic, setTopic] = useState("all");
  const [type, setType] = useState<EssayType | "all">("all");
  const [promptId, setPromptId] = useState(PROMPTS[0].id);
  const prompt = PROMPTS.find((p) => p.id === promptId)!;
  const guide = ESSAY_GUIDE[prompt.type];
  const topics = [...new Set(PROMPTS.map((p) => p.topic))];
  const filtered = PROMPTS.filter((p) => (topic === "all" || p.topic === topic) && (type === "all" || p.type === type));

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 min-w-0">
        <Card>
          <div className="flex flex-wrap gap-2 mb-3">
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              <option value="all">Mọi chủ đề</option>
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value as EssayType | "all")} className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              <option value="all">Mọi dạng bài</option>
              {Object.keys(ESSAY_GUIDE).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select value={promptId} onChange={(e) => setPromptId(e.target.value)} className="flex-1 min-w-52 rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              {filtered.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.topic}] {p.prompt.slice(0, 70)}…
                </option>
              ))}
            </select>
            <Button variant="ghost" onClick={() => filtered.length && setPromptId(filtered[Math.floor(Math.random() * filtered.length)].id)}>
              🎲
            </Button>
          </div>
          <div className="rounded-xl border-2 border-write p-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Pill color="var(--write)">{prompt.type}</Pill>
              <Pill>{prompt.topic}</Pill>
            </div>
            <p className="font-medium leading-relaxed">{prompt.prompt}</p>
            <p className="mt-2 text-xs text-muted">Write at least 250 words. Thời gian: 40 phút.</p>
          </div>
        </Card>
        <EssayEditor key={promptId} kind="task2" promptId={promptId} prompt={prompt.prompt} minutes={40} minWords={250} rows={18} />
        <EssayHistory kind="task2" />
      </div>

      <div className="space-y-4">
        <Card className="text-sm">
          <div className="font-semibold mb-1 text-write">Dàn ý: {prompt.type}</div>
          <p className="text-muted mb-2">{guide.vi}</p>
          <ol className="list-decimal pl-4 space-y-1">
            {guide.plan.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Card>
        <SelfCheck key={promptId} />
      </div>
    </div>
  );
}

function SelfCheck() {
  const [checks, setChecks] = useState<boolean[]>([]);
  return (
    <Card className="text-sm">
      <div className="font-semibold mb-2">Tự kiểm tra trước khi lưu</div>
      <div className="space-y-1.5">
        {SELF_CHECK.map((c, i) => (
          <label key={c} className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={!!checks[i]}
              onChange={(e) => setChecks((arr) => Object.assign([...arr], { [i]: e.target.checked }))}
            />
            <span className={checks[i] ? "text-muted line-through" : ""}>{c}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}
