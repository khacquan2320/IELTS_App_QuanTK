"use client";

import { useMemo, useState } from "react";
import { MATERIALS, type Material } from "@/lib/materials";
import { DocViewer } from "./DocViewer";
import { Card } from "./ui";

const ICON: Record<string, string> = { audio: "🎵", pdf: "📕", doc: "📄", image: "🖼️" };

/** Duyệt tài liệu khóa học theo tuần. `filter` để chỉ hiện tài liệu của 1 kỹ năng. */
export function MaterialBrowser({ filter, color = "var(--accent)" }: { filter?: (m: Material) => boolean; color?: string }) {
  const [current, setCurrent] = useState<string | null>(null);
  const currentFile = MATERIALS.find((m) => m.path === current);

  const groups = useMemo(() => {
    const m = new Map<string, Material[]>();
    for (const x of MATERIALS) {
      if (x.kind === "audio" || (filter && !filter(x))) continue;
      const key = x.week ? `Tuần ${x.week}` : x.dir === "." ? "Bài kiểm tra & khác" : x.dir.split("/")[0];
      m.set(key, [...(m.get(key) || []), x]);
    }
    return [...m.entries()];
  }, [filter]);

  if (!groups.length) return <Card className="text-muted">Chưa có tài liệu phù hợp.</Card>;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="lg:max-h-[80vh] lg:overflow-y-auto p-3">
        {groups.map(([title, list]) => (
          <div key={title} className="mb-3">
            <div className="px-2 py-1 text-xs font-semibold uppercase text-muted">{title}</div>
            {list.map((m) => (
              <button
                key={m.path}
                onClick={() => setCurrent(m.path)}
                className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                  current === m.path ? "bg-accent-soft font-semibold" : "hover:bg-bg"
                }`}
                style={current === m.path ? { color } : undefined}
                title={m.path}
              >
                <span>{ICON[m.kind]}</span>
                <span className="line-clamp-2">{m.name.replace(/\.(docx|pdf|jpe?g|png)$/i, "")}</span>
              </button>
            ))}
          </div>
        ))}
      </Card>
      <Card className="min-w-0">
        {currentFile ? (
          <>
            <div className="mb-3 text-xs text-muted break-all">{currentFile.path}</div>
            <DocViewer key={currentFile.key} file={currentFile} />
          </>
        ) : (
          <p className="text-muted">← Chọn một tài liệu để xem.</p>
        )}
      </Card>
    </div>
  );
}
