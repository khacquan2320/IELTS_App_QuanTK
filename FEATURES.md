# IELTS Daily — Chức năng & lộ trình

Web app luyện IELTS cho 2 người dùng. Mục tiêu band 6.0–6.5. Chi phí 0đ (Vercel Hobby + Supabase free + AI miễn phí).

- **Link production:** https://ielts-app-opal.vercel.app
- **Stack:** Next.js 16, React 19, Tailwind 4, Supabase (Auth + Postgres + Storage), deploy bằng Vercel CLI
- **Cập nhật lần cuối:** 2026-10-12 (thêm code Giai đoạn 2)

## Tổng quan giai đoạn

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 1 | Nền tảng luyện 4 kỹ năng + từ vựng + thư viện tài liệu + đăng nhập/cloud | ✅ Hoàn thành (2026-10-01) |
| 2 | AI chấm Writing & Speaking | 🛠️ Đã code xong (2026-10-12), chờ cấu hình API key + deploy |
| 3 | Thống kê, thi thử đầy đủ, AI bạn hội thoại | 🗓️ Dự kiến |

---

## Giai đoạn 1 — Đã có

### Tài khoản & hạ tầng
- Đăng nhập bằng Supabase Auth. Đăng ký tự do đã tắt, 2 tài khoản được tạo thủ công.
- Tiến độ lưu trên cloud (bảng `progress`, có RLS), mỗi người một dữ liệu riêng.
- Tài liệu khóa học nằm trong bucket private `materials`, đẩy lên bằng `npm run upload`.
- Giao diện có avatar theo email, footer bản quyền, hỗ trợ mobile và desktop.

### Dashboard (`/`)
- Danh sách việc cần làm mỗi ngày theo kỹ năng.
- Writing tự đánh dấu hoàn thành khi đạt đủ số từ.

### Từ vựng (`/vocab`)
- Ôn theo lặp lại ngắt quãng (SRS).
- Kho từ theo chủ đề IELTS: 22 chủ đề, khoảng 444 từ, cùng từ vựng từ khóa học.
- Chọn chủ đề để học từ mới, có trang duyệt chủ đề kèm tiến độ.
- Lưu từ mới gặp khi đọc/nghe.

### Reading (`/reading`)
- 11 bài đọc, hơn 130 câu hỏi, lọc theo chủ đề.
- Gồm bài gốc từ khóa học và bài bổ sung theo chủ đề IELTS.

### Listening (`/listening`)
- Nghe chép chính tả (dictation) với nhiều bộ, gồm Office Communication, Travel, Services.
- Nghe file mp3 của khóa học, tải từ cloud.
- Luyện số (number drills).

### Speaking (`/speaking`)
- 14 chủ đề Part 1, 16 cue card Part 2, kèm câu hỏi Part 3.
- Mô phỏng thi 3 phần, có ghi âm để tự nghe lại.
- **Chưa có chấm điểm AI.**

### Writing (`/writing`)
- Chia 3 phần: Task 1, Task 2, và viết dựa trên bài đọc.
- Task 2: 22 đề, 5 dạng bài kèm hướng dẫn, đồng hồ 40 phút, lưu lịch sử bài viết.
- Task 1 có biểu đồ minh họa.
- **Chưa có chấm điểm AI.**

### Thư viện (`/library`)
- Duyệt và xem tài liệu khóa học (slide, vở ghi chép, đề thi), file docx đã chuyển sang HTML.

---

## Giai đoạn 2 — AI chấm bài (code xong, chưa deploy)

- **Writing:** nộp bài, AI chấm theo 4 tiêu chí (Task Response, Coherence & Cohesion, Lexical Resource, Grammar), cho band ước lượng, nhận xét, lỗi cần sửa và gợi ý viết lại.
- **Speaking:** dùng Web Speech API chuyển giọng nói thành chữ, AI chấm Fluency, Lexical Resource, Grammar. Pronunciation chỉ đánh giá hạn chế vì AI chỉ nhận văn bản.
- **Nhà cung cấp AI cắm được:** mặc định Gemini free tier, thay thế là Groq hoặc Ollama (local).
- **Bảo mật:** API key để ở server (route API + biến môi trường Vercel), không đưa ra trình duyệt.
- **Ghi chú:** bài viết sẽ được gửi tới nhà cung cấp AI để chấm. Band AI chỉ mang tính tham khảo.
- **Cần chuẩn bị:** Gemini API key (https://aistudio.google.com/apikey).

### Đã làm
- API `POST /api/grade` (`src/app/api/grade/route.ts`): bắt buộc đăng nhập (kiểm tra token Supabase), giới hạn độ dài bài, trả JSON đã chuẩn hoá.
- Lớp nhà cung cấp AI (`src/lib/ai/providers.ts`): Gemini / Groq / Ollama, chọn bằng `AI_PROVIDER`.
- Prompt chấm theo band descriptor, tiếng Việt cho phần nhận xét (`src/lib/ai/grading.ts`).
- Writing: nút **🤖 Chấm bằng AI** ở Task 1 và Task 2. Tự lưu bài, hiện band + 4 tiêu chí, lỗi kèm câu sửa, nâng cấp từ vựng, việc luyện tiếp. Task 1 gửi kèm số liệu biểu đồ để đối chiếu. Kết quả lưu trong lịch sử bài viết.
- Speaking: ghi âm đồng thời **chép lời tự động** (Web Speech API, dùng Chrome/Edge), sửa lời chép rồi bấm chấm (Part 1, 2, 3). Chấm Fluency/Lexical/Grammar, không chấm phát âm. Kết quả lưu trong `progress.speaking` và đánh dấu xong nhiệm vụ Speaking.
- Đồng hồ 40 phút Task 2 đã có từ Giai đoạn 1.

### Còn lại để chạy thật
1. Đặt `GEMINI_API_KEY` (và `AI_PROVIDER=gemini`) vào `.env.local` và Environment Variables của Vercel.
2. Deploy lại: `npx vercel --prod`.
3. Chấm thử vài bài để kiểm tra chất lượng, rồi chỉnh prompt nếu band lệch nhiều.

Lưu ý: Chrome gửi âm thanh tới dịch vụ nhận diện giọng nói của Google khi chép lời.

## Giai đoạn 3 — Dự kiến
- Biểu đồ thống kê tiến bộ.
- Thi thử đầy đủ 4 kỹ năng.
- AI làm bạn luyện hội thoại.

---

## Lưu ý vận hành
- Supabase free **tự tạm dừng sau khoảng 7 ngày không hoạt động**. Khi đó web mở được nhưng không đăng nhập được. Cách xử lý: vào https://supabase.com/dashboard và bấm **Restore project** (khôi phục được trong khoảng 90 ngày).
- Nên dùng link `ielts-app-opal.vercel.app`. Các link `*-khacquansiu.vercel.app` bị Vercel Authentication chặn.
- Lệnh chấm AI dùng hạn mức miễn phí của Gemini; hết hạn mức sẽ báo lỗi và thử lại sau.
- Có thể thêm Vercel Cron ping Supabase để tránh bị pause (chưa làm).
