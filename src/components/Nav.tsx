"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { streak, useProgress } from "@/lib/progress";
import { supabase } from "@/lib/supabase";
import { useSession } from "./AuthGate";
import { Avatar, displayName } from "./Avatar";

const LINKS = [
  { href: "/", label: "Hôm nay", icon: "🏠", color: "var(--accent)" },
  { href: "/vocab", label: "Từ vựng", icon: "🃏", color: "var(--vocab)" },
  { href: "/reading", label: "Reading", icon: "📖", color: "var(--read)" },
  { href: "/listening", label: "Listening", icon: "🎧", color: "var(--listen)" },
  { href: "/writing", label: "Writing", icon: "✍️", color: "var(--write)" },
  { href: "/speaking", label: "Speaking", icon: "🗣️", color: "var(--speak)" },
  { href: "/library", label: "Tài liệu khóa học", icon: "📁", color: "var(--muted)" },
];

export function Nav() {
  const pathname = usePathname();
  const { progress, saveError } = useProgress();
  const session = useSession();
  const s = streak(progress);

  return (
    <nav className="relative md:w-56 md:shrink-0 md:min-h-screen border-b md:border-b-0 md:border-r border-border bg-card md:sticky md:top-0 md:h-screen">
      <div className="px-4 py-3 md:py-6 flex md:block items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          IELTS <span className="text-accent">Daily</span>
        </Link>
        <div className="md:mt-2 flex items-center gap-3 text-sm text-muted">
          <span title="Số ngày học liên tục">🔥 {s} ngày liên tục</span>
          <button onClick={() => supabase.auth.signOut()} className="md:hidden" title={`${session?.user.email} · Bấm để đăng xuất`}>
            <Avatar email={session?.user.email} size={32} />
          </button>
        </div>
      </div>
      <ul className="flex md:flex-col gap-1 overflow-x-auto px-2 pb-2 md:pb-0">
        {LINKS.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-accent-soft font-semibold" : "hover:bg-bg"
                }`}
                style={active ? { color: l.color } : undefined}
              >
                <span aria-hidden>{l.icon}</span>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="hidden md:block absolute bottom-0 left-0 w-56 border-t border-border p-4">
        {saveError && <p className="mb-2 text-xs text-bad">⚠ Chưa lưu được tiến độ — kiểm tra mạng.</p>}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg p-2.5">
          <Avatar email={session?.user.email} size={40} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold" title={session?.user.email}>
              {displayName(session?.user.email)}
            </div>
            <button onClick={() => supabase.auth.signOut()} className="text-xs text-muted hover:text-bad">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
