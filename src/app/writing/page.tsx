"use client";

import { useState } from "react";
import { MaterialBrowser } from "@/components/MaterialBrowser";
import { ReadWritePractice } from "@/components/writing/ReadWritePractice";
import { Task1Practice } from "@/components/writing/Task1Practice";
import { Task2Practice } from "@/components/writing/Task2Practice";
import { SkillTodo } from "@/components/SkillTodo";
import { Button, Card, PageHeader } from "@/components/ui";
import type { Material } from "@/lib/materials";

const isWriting = (m: Material) => m.skill === "writing" || m.skill === "speaking-writing" || m.skill === "grammar";

export default function WritingPage() {
  const [tab, setTab] = useState<"task1" | "task2" | "readwrite" | "course">("task1");
  return (
    <div>
      <PageHeader
        title="Writing"
        color="var(--write)"
        subtitle="Viết bài Task 2 có bấm giờ, đếm từ, dàn ý theo dạng bài và lưu lại bài đã viết. Giai đoạn 2: AI chấm band theo 4 tiêu chí."
      />
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <SkillTodo task="writing" color="var(--write)">
          <p>• Ngày thường (15′): làm 1 bài tập nhỏ — viết lại đề bằng từ khác (paraphrase), viết mở bài, hoặc 1 đoạn thân bài.</p>
          <p>• Cuối tuần (40′): viết 1 bài Task 2 hoàn chỉnh, tối thiểu 250 từ.</p>
          <p>• Dùng ít nhất 3 từ trong flashcard tuần này.</p>
        </SkillTodo>
        <Card className="text-sm">
          <div className="font-semibold mb-2">4 tiêu chí chấm Writing</div>
          <ul className="space-y-1.5 text-muted">
            <li><b className="text-text">Task Response</b> — trả lời đúng và đủ mọi phần của đề, có quan điểm rõ ràng.</li>
            <li><b className="text-text">Coherence &amp; Cohesion</b> — chia đoạn hợp lý, dùng từ nối tự nhiên (However, As a result…).</li>
            <li><b className="text-text">Lexical Resource</b> — từ vựng đa dạng, đúng ngữ cảnh, không lặp từ.</li>
            <li><b className="text-text">Grammar</b> — kết hợp câu đơn và câu phức, ít lỗi.</li>
          </ul>
        </Card>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={tab === "task1" ? "primary" : "outline"} onClick={() => setTab("task1")}>
          Task 1 — Mô tả biểu đồ
        </Button>
        <Button variant={tab === "task2" ? "primary" : "outline"} onClick={() => setTab("task2")}>
          Task 2 — Bài luận
        </Button>
        <Button variant={tab === "readwrite" ? "primary" : "outline"} onClick={() => setTab("readwrite")}>
          Đọc & viết câu trả lời
        </Button>
        <Button variant={tab === "course" ? "primary" : "outline"} onClick={() => setTab("course")}>
          Tài liệu khóa học
        </Button>
      </div>
      {tab === "task1" && <Task1Practice />}
      {tab === "task2" && <Task2Practice />}
      {tab === "readwrite" && <ReadWritePractice />}
      {tab === "course" && <MaterialBrowser filter={isWriting} color="var(--write)" />}
    </div>
  );
}
