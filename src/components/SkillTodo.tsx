"use client";

import { taskStatus, useProgress } from "@/lib/progress";
import type { TaskKey } from "@/lib/types";
import { Card } from "./ui";

/** Ô đánh dấu đã luyện xong kỹ năng hôm nay (dùng cho Writing/Speaking ở giai đoạn 1). */
export function SkillTodo({ task, color, children }: { task: TaskKey; color: string; children: React.ReactNode }) {
  const { progress, allCards, updateDay } = useProgress();
  const done = taskStatus(progress, allCards)[task];
  return (
    <Card className={done ? "border-ok bg-ok-soft" : ""}>
      <div className="font-semibold mb-2" style={{ color }}>
        Nhiệm vụ hôm nay
      </div>
      <div className="text-sm space-y-1.5">{children}</div>
      <label className="mt-4 flex items-center gap-2 font-medium cursor-pointer">
        <input type="checkbox" checked={done} onChange={(e) => updateDay((d) => void (d.manual[task] = e.target.checked))} />
        Đã luyện xong hôm nay
      </label>
    </Card>
  );
}
