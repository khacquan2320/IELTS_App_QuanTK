import type { AiGrade } from "@/lib/types";
import { Card } from "./ui";

const bandColor = (b: number) => (b >= 6.5 ? "text-ok" : b >= 5.5 ? "text-warn" : "text-bad");

/** Hiển thị kết quả AI chấm (Writing hoặc Speaking). */
export function GradeCard({ grade }: { grade: AiGrade }) {
  return (
    <Card className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className={`text-4xl font-bold ${bandColor(grade.band)}`}>{grade.band.toFixed(1)}</div>
        <div className="text-muted">
          Band ước lượng bởi AI ({grade.model}, {grade.date}).
          <br />
          Chỉ để tham khảo, có thể lệch 0.5–1.0 so với giám khảo thật.
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {grade.criteria.map((c) => (
          <div key={c.name} className="rounded-lg bg-bg p-3">
            <div className="flex items-baseline justify-between gap-2">
              <b>{c.name}</b>
              <span className={`font-bold ${bandColor(c.band)}`}>{c.band.toFixed(1)}</span>
            </div>
            <p className="mt-1 text-muted">{c.comment}</p>
          </div>
        ))}
      </div>

      {grade.strengths.length > 0 && (
        <div>
          <div className="mb-1 font-semibold text-ok">Điểm tốt</div>
          <ul className="list-disc space-y-0.5 pl-5">
            {grade.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {grade.issues.length > 0 && (
        <div>
          <div className="mb-1 font-semibold text-bad">Lỗi cần sửa</div>
          <ul className="space-y-2">
            {grade.issues.map((i, k) => (
              <li key={k} className="rounded-lg bg-bg p-3">
                {i.quote && <p className="italic text-bad">“{i.quote}”</p>}
                <p className="mt-0.5">{i.problem}</p>
                {i.fix && <p className="mt-0.5 text-ok">→ {i.fix}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {grade.upgrades.length > 0 && (
        <div>
          <div className="mb-1 font-semibold">Nâng cấp từ vựng</div>
          <ul className="space-y-0.5">
            {grade.upgrades.map((u, k) => (
              <li key={k}>
                <span className="text-muted">{u.from}</span> → <b>{u.to}</b>
              </li>
            ))}
          </ul>
        </div>
      )}

      {grade.nextSteps.length > 0 && (
        <div>
          <div className="mb-1 font-semibold">Luyện tiếp</div>
          <ul className="list-disc space-y-0.5 pl-5">
            {grade.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
