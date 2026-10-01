import type { Task1 } from "@/content/writing-task1";

const COLORS = ["var(--read)", "var(--write)", "var(--speak)", "var(--listen)", "var(--vocab)"];
const W = 560;
const H = 280;
const PAD = { l: 44, r: 12, t: 12, b: 32 };

function niceMax(v: number) {
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / step) * step;
}

function Legend({ names }: { names: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
      {names.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
          {n}
        </span>
      ))}
    </div>
  );
}

function Axes({ max, labels, children }: { max: number; labels: string[]; children: React.ReactNode }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const y = (v: number) => PAD.t + (H - PAD.t - PAD.b) * (1 - v / max);
  const step = (W - PAD.l - PAD.r) / labels.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" />
          <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
            {t}
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={l} x={PAD.l + step * (i + 0.5)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--muted)">
          {l}
        </text>
      ))}
      {children}
    </svg>
  );
}

/** Vẽ biểu đồ cho đề Task 1 (đường, cột, tròn, bảng, quy trình). */
export function Task1Chart({ task }: { task: Task1 }) {
  const { kind, categories, series, unit } = task;

  if (kind === "process")
    return (
      <ol className="flex flex-col items-center gap-1">
        {categories.map((step, i) => (
          <li key={step} className="flex flex-col items-center">
            <div className="rounded-lg border-2 px-4 py-2 text-center text-sm" style={{ borderColor: COLORS[i % COLORS.length] }}>
              <b className="mr-1">{i + 1}.</b>
              {step}
            </div>
            {i < categories.length - 1 && <span className="text-muted">↓</span>}
          </li>
        ))}
      </ol>
    );

  if (kind === "table")
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-border p-2 text-left text-muted">({unit})</th>
              {series.map((s) => (
                <th key={s.name} className="border border-border p-2">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c}>
                <td className="border border-border p-2 font-medium">{c}</td>
                {series.map((s) => (
                  <td key={s.name} className="border border-border p-2 text-center">
                    {s.values[i]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  if (kind === "pie")
    return (
      <div>
        <div className="flex flex-wrap justify-center gap-6">
          {series.map((s) => {
            const total = s.values.reduce((a, b) => a + b, 0);
            let angle = -Math.PI / 2;
            return (
              <figure key={s.name} className="text-center">
                <svg viewBox="-110 -110 220 220" className="w-48 h-48">
                  {s.values.map((v, i) => {
                    const a0 = angle;
                    const a1 = (angle += (v / total) * Math.PI * 2);
                    const large = a1 - a0 > Math.PI ? 1 : 0;
                    const mid = (a0 + a1) / 2;
                    return (
                      <g key={i}>
                        <path
                          d={`M0 0 L${100 * Math.cos(a0)} ${100 * Math.sin(a0)} A100 100 0 ${large} 1 ${100 * Math.cos(a1)} ${100 * Math.sin(a1)} Z`}
                          fill={COLORS[i % COLORS.length]}
                          stroke="var(--card)"
                          strokeWidth="2"
                        />
                        <text x={65 * Math.cos(mid)} y={65 * Math.sin(mid) + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff">
                          {v}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <figcaption className="font-semibold">{s.name}</figcaption>
              </figure>
            );
          })}
        </div>
        <Legend names={categories} />
      </div>
    );

  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const plotH = H - PAD.t - PAD.b;
  const step = (W - PAD.l - PAD.r) / categories.length;
  const y = (v: number) => PAD.t + plotH * (1 - v / max);

  return (
    <div>
      <p className="mb-1 text-xs text-muted">({unit})</p>
      <Axes max={max} labels={categories}>
        {kind === "line"
          ? series.map((s, si) => (
              <g key={s.name}>
                <polyline
                  fill="none"
                  stroke={COLORS[si % COLORS.length]}
                  strokeWidth="2.5"
                  points={s.values.map((v, i) => `${PAD.l + step * (i + 0.5)},${y(v)}`).join(" ")}
                />
                {s.values.map((v, i) => (
                  <circle key={i} cx={PAD.l + step * (i + 0.5)} cy={y(v)} r="3.5" fill={COLORS[si % COLORS.length]}>
                    <title>
                      {s.name} {categories[i]}: {v}
                    </title>
                  </circle>
                ))}
              </g>
            ))
          : categories.map((_, ci) => {
              const groupW = step * 0.7;
              const barW = groupW / series.length;
              return series.map((s, si) => {
                const v = s.values[ci];
                const x = PAD.l + step * ci + (step - groupW) / 2 + barW * si;
                return (
                  <g key={`${ci}-${si}`}>
                    <rect x={x + 1} y={y(v)} width={barW - 2} height={plotH - (y(v) - PAD.t)} rx="2" fill={COLORS[si % COLORS.length]} />
                    <text x={x + barW / 2} y={y(v) - 4} textAnchor="middle" fontSize="10" fill="var(--muted)">
                      {v}
                    </text>
                  </g>
                );
              });
            })}
      </Axes>
      <Legend names={series.map((s) => s.name)} />
    </div>
  );
}
