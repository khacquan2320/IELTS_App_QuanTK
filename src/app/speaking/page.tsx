"use client";

import { useState } from "react";
import { MaterialBrowser } from "@/components/MaterialBrowser";
import { SpeakingPractice } from "@/components/SpeakingPractice";
import { SkillTodo } from "@/components/SkillTodo";
import { Button, Card, PageHeader } from "@/components/ui";
import type { Material } from "@/lib/materials";

const isSpeaking = (m: Material) => m.skill === "speaking" || m.skill === "speaking-writing";

export default function SpeakingPage() {
  const [tab, setTab] = useState<"practice" | "course">("practice");
  return (
    <div>
      <PageHeader
        title="Speaking"
        color="var(--speak)"
        subtitle="Luyện Part 1, 2, 3 theo chủ đề: nghe câu hỏi, bấm giờ cue card, ghi âm để tự nghe lại. Giai đoạn 2: chuyển giọng nói thành chữ và AI nhận xét."
      />
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <SkillTodo task="speaking" color="var(--speak)">
          <p>• Part 1 (5′): trả lời 4–5 câu, mỗi câu 2–3 câu nói: trả lời → lý do → ví dụ.</p>
          <p>• Part 2 (5′): 1 phút chuẩn bị, nói liền 2 phút về 1 cue card.</p>
          <p>• Shadowing (5′): nghe 1 đoạn và nhại lại ngay (tài liệu Shadowing tuần 1).</p>
        </SkillTodo>
        <Card className="text-sm">
          <div className="font-semibold mb-2">Từ TOEIC lên IELTS Speaking</div>
          <ul className="space-y-1.5 text-muted">
            <li>• Đừng trả lời 1 câu cụt — giám khảo cần nghe bạn <b className="text-text">nói dài và tự nhiên</b>.</li>
            <li>• Nói sai vẫn tốt hơn im lặng: <b className="text-text">Fluency</b> chiếm 25% điểm.</li>
            <li>• Dùng từ nối khi nói: <i>Well, Actually, To be honest, The thing is…</i></li>
            <li>• Ghi âm lại và nghe: đếm số lần “ừm”, lặp từ, và các âm cuối bị nuốt (-s, -ed).</li>
          </ul>
        </Card>
      </div>
      <div className="mb-4 flex gap-2">
        <Button variant={tab === "practice" ? "primary" : "outline"} onClick={() => setTab("practice")}>
          Luyện nói (14 chủ đề + 16 cue card)
        </Button>
        <Button variant={tab === "course" ? "primary" : "outline"} onClick={() => setTab("course")}>
          Tài liệu khóa học
        </Button>
      </div>
      {tab === "practice" ? <SpeakingPractice /> : <MaterialBrowser filter={isSpeaking} color="var(--speak)" />}
    </div>
  );
}
