"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { ProgressProvider } from "@/lib/progress";
import { isConfigured, supabase } from "@/lib/supabase";
import { Footer } from "./Footer";
import { Button, Card } from "./ui";

const SessionContext = createContext<Session | null>(null);
export const useSession = () => useContext(SessionContext);

/** Chỉ hiện nội dung web khi đã đăng nhập; mỗi tài khoản có tiến độ học riêng. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isConfigured)
    return (
      <Centered>
        <h1 className="text-lg font-bold">Chưa cấu hình Supabase</h1>
        <p className="mt-2 text-sm text-muted">
          Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào file .env.local (chạy trên máy) hoặc vào Environment
          Variables của Vercel. Xem hướng dẫn trong README.md.
        </p>
      </Centered>
    );
  if (session === undefined) return <Centered>Đang tải…</Centered>;
  if (!session) return <Login />;

  return (
    <SessionContext.Provider value={session}>
      <ProgressProvider key={session.user.id} userId={session.user.id}>
        {children}
      </ProgressProvider>
    </SessionContext.Provider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">{children}</Card>
      <Footer />
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError(error.message === "Invalid login credentials" ? "Sai email hoặc mật khẩu." : error.message);
    setBusy(false);
  }

  return (
    <Centered>
      <h1 className="text-xl font-bold">
        IELTS <span className="text-accent">Daily</span>
      </h1>
      <p className="mt-1 mb-5 text-sm text-muted">Đăng nhập để tiếp tục học</p>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        />
        {error && <p className="text-sm text-bad">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full py-2.5">
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </form>
    </Centered>
  );
}
