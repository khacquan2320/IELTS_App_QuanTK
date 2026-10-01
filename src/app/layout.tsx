import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AuthGate } from "@/components/AuthGate";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "IELTS Daily",
  description: "Học IELTS mỗi ngày: Reading, Listening, Writing, Speaking",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AuthGate>
          <div className="md:flex min-h-screen">
            <Nav />
            <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto max-w-6xl">
                {children}
                <Footer />
              </div>
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
