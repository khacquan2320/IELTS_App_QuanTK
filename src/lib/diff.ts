const norm = (w: string) => w.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9-]/g, "");

export type DiffToken = { word: string; status: "ok" | "missing" | "extra" };

/** So sánh câu gõ với câu gốc theo từng từ (thuật toán LCS). Bỏ qua hoa/thường và dấu câu. */
export function diffWords(target: string, typed: string): { tokens: DiffToken[]; correct: number; total: number } {
  const t = target.split(/\s+/).filter((w) => norm(w));
  const u = typed.split(/\s+/).filter((w) => norm(w));
  const n = t.length, m = u.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = norm(t[i]) === norm(u[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const tokens: DiffToken[] = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && norm(t[i]) === norm(u[j])) {
      tokens.push({ word: t[i], status: "ok" });
      i++; j++;
    } else if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) {
      tokens.push({ word: u[j], status: "extra" });
      j++;
    } else {
      tokens.push({ word: t[i], status: "missing" });
      i++;
    }
  }
  return { tokens, correct: dp[0][0], total: n };
}
