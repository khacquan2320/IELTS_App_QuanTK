"use client";

import { useState } from "react";
import { TASK1, TASK1_GUIDE } from "@/content/writing-task1";
import { Button, Card, Pill } from "../ui";
import { EssayEditor } from "./EssayEditor";
import { EssayHistory } from "./EssayHistory";
import { Task1Chart } from "./Task1Chart";

const KIND_LABEL = { line: "Line graph", bar: "Bar chart", pie: "Pie chart", table: "Table", process: "Process" };

export function Task1Practice() {
  const [id, setId] = useState(TASK1[0].id);
  const [showOverview, setShowOverview] = useState(false);
  const task = TASK1.find((t) => t.id === id)!;

  function choose(next: string) {
    setId(next);
    setShowOverview(false);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 min-w-0">
        <Card>
          <div className="flex flex-wrap gap-2 mb-3">
            <select value={id} onChange={(e) => choose(e.target.value)} className="flex-1 min-w-52 rounded-lg border border-border bg-bg px-3 py-2 text-sm">
              {TASK1.map((t) => (
                <option key={t.id} value={t.id}>
                  [{KIND_LABEL[t.kind]}] {t.title}
                </option>
              ))}
            </select>
            <Button variant="ghost" onClick={() => choose(TASK1[Math.floor(Math.random() * TASK1.length)].id)}>
              🎲
            </Button>
          </div>
          <div className="rounded-xl border-2 border-write p-4">
            <Pill color="var(--write)">{KIND_LABEL[task.kind]}</Pill>
            <p className="mt-2 font-medium leading-relaxed">{task.prompt}</p>
            <p className="mt-2 text-xs text-muted">Write at least 150 words. Thời gian: 20 phút. (Số liệu giả định để luyện tập.)</p>
            <div className="mt-4 rounded-lg bg-bg p-3">
              <p className="mb-2 text-center text-sm font-semibold">{task.title}</p>
              <Task1Chart task={task} />
            </div>
          </div>
        </Card>
        <EssayEditor key={id} kind="task1" promptId={id} prompt={task.prompt} minutes={20} minWords={150} rows={12} />
        <EssayHistory kind="task1" />
      </div>

      <div className="space-y-4">
        <Card className="text-sm">
          <div className="font-semibold mb-2 text-write">Cấu trúc bài Task 1</div>
          <ol className="list-decimal pl-4 space-y-1">
            {TASK1_GUIDE.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Card>
        <Card className="text-sm">
          <div className="font-semibold mb-2">Gợi ý cho đề này</div>
          <ul className="list-disc pl-4 space-y-1 text-muted">
            {task.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="mt-4">
            {showOverview ? (
              <div className="rounded-lg bg-ok-soft p-3">
                <div className="mb-1 text-xs font-semibold text-ok">Overview mẫu</div>
                {task.overview}
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowOverview(true)}>
                Xem overview mẫu (sau khi tự viết)
              </Button>
            )}
          </div>
          <p className="mt-4 text-muted">
            💡 Từ vựng mô tả biểu đồ: <b className="text-text">Từ vựng → Chủ đề → Describing Trends</b>.
          </p>
        </Card>
      </div>
    </div>
  );
}
