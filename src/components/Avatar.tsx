const COLORS = ["#2f6fde", "#8a4fd8", "#c2620e", "#1f9d77", "#d4447a", "#0e8fa8", "#b8860b"];

/** Tên hiển thị lấy từ phần trước @ của email, ví dụ khacquan2320@gmail.com → khacquan2320 */
export const displayName = (email = "") => email.split("@")[0];

/** Avatar chữ cái đầu, màu cố định theo email để 2 tài khoản dễ phân biệt. */
export function Avatar({ email = "", size = 36 }: { email?: string; size?: number }) {
  const name = displayName(email);
  const hash = [...email].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase text-white select-none"
      style={{ width: size, height: size, fontSize: size * 0.42, background: COLORS[hash % COLORS.length] }}
      aria-hidden
    >
      {name.slice(0, 1) || "?"}
    </span>
  );
}
