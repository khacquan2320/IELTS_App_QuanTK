"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import type { EssayKind } from "@/lib/types";
import { Card } from "../ui";

/** Danh sách bài đã viết của 1 mục (Task 1 / Task 2 / Đọc & viết). */
export function EssayHistory({ kind }: { kind: EssayKind }) {
  const { progress } = useProgress();
  const [open, setOpen] = useState<string | null>(null);
  const essays = progress.essays.filter((e) => (e.kind ?? "task2") === kind);
  if (!essays.length) return null;

  return (
    <Card>
      <h3 className="font-semibold mb-2">Bài đã viết ({essays.length})</h3>
      <ul className="divide-y divide-border text-sm">
        {essays.map((e) => (
          <li key={e.id} className="py-2">
            <button className="w-full text-left" onClick={() => setOpen(open === e.id ? null : e.id)}>
              <span className="text-muted">{e.date}</span> · <b>{e.words} từ</b> · {Math.round(e.seconds / 60)} phút ·{" "}
              <span className="text-muted">{e.prompt.slice(0, 70)}…</span>
            </button>
            {open === e.id && (
              <div className="mt-2 rounded-lg bg-bg p-3">
                <p className="mb-2 font-medium">{e.prompt}</p>
                <p className="whitespace-pre-wrap">{e.text}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
