# IELTS Daily

Web học IELTS mỗi ngày cho 2 người, dùng tài liệu khóa L5.5. Chạy trên **Vercel** (miễn phí), dữ liệu và tài liệu lưu ở **Supabase** (miễn phí).

- Đăng nhập bằng email + mật khẩu, mỗi người có tiến độ học riêng.
- Tài liệu khóa học nằm trong kho riêng tư, chỉ người đã đăng nhập mới xem được.

---

## Cài đặt lần đầu

### Bước 1 — Tạo Supabase (database + kho tài liệu)
1. Vào https://supabase.com → **Start your project** → đăng nhập (có thể dùng tài khoản GitHub hoặc email).
2. **New project**: đặt tên `ielts-daily`, đặt mật khẩu database (lưu lại), Region chọn **Southeast Asia (Singapore)**.
3. Đợi khoảng 2 phút cho project khởi tạo xong. Vào **SQL Editor → New query**, dán toàn bộ nội dung file `supabase/setup.sql`, rồi bấm **Run**.
4. **Authentication → Sign In / Providers**: tắt **Allow new users to sign up**, để người lạ không tự tạo được tài khoản.
5. **Authentication → Users → Add user → Create new user**: tạo 2 tài khoản (email + mật khẩu) và tick **Auto Confirm User**.
6. **Project Settings → API Keys**: lấy **Project URL**, **Publishable key** và **Secret key**.

### Bước 2 — Điền khóa và tải tài liệu lên
1. Copy file `.env.example` thành `.env.local`, rồi điền 3 giá trị vừa lấy ở bước 1.6.
2. Chạy:
   ```bash
   npm run upload
   ```
   Lệnh này tải khoảng 90 file (khoảng 300MB) lên Supabase. Lần đầu mất vài phút.
3. Kiểm tra trên máy: `npm run dev` → mở http://localhost:3000 → đăng nhập.

### Bước 3 — Đưa web lên Vercel
```bash
npx vercel login
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel --prod
```
`vercel login` sẽ mở trình duyệt để bạn đăng ký hoặc đăng nhập Vercel (gói **Hobby**, miễn phí). Khi chạy `vercel link`, cứ bấm Enter để giữ các lựa chọn mặc định. Chạy xong, Vercel in ra link dạng `https://ielts-app-xxx.vercel.app`, gửi link này cho người còn lại.

> ⚠️ Chỉ thêm 2 biến `NEXT_PUBLIC_...` vào Vercel. **Không** đưa `SUPABASE_SERVICE_ROLE_KEY` lên Vercel.

---

## Cập nhật sau này
| Việc | Lệnh |
|---|---|
| Sửa code / thêm bài đọc → cập nhật web | `npx vercel --prod` |
| Thêm tài liệu khóa học mới | `npm run upload` rồi `npx vercel --prod` |
| Thêm Vocab List mới vào flashcard | `npm run import` rồi `npx vercel --prod` |

- Thêm bài đọc: `src/content/reading.ts`. Thêm câu chép chính tả: `src/content/dictation.ts`.
- Đổi mật khẩu / thêm người dùng: Supabase → Authentication → Users.

## Chức năng
| Trang | Nội dung |
|---|---|
| Hôm nay | 5 nhiệm vụ/ngày, chuỗi ngày học, thống kê |
| Từ vựng | ~370 flashcard từ Vocab List của khóa, ôn theo lịch lặp lại ngắt quãng |
| Reading | 5 bài đọc band 5.5–6.5, bấm giờ, chấm điểm, giải thích tiếng Việt, bôi đen để lưu từ |
| Listening | Chép chính tả · 29 file mp3 của khóa kèm đề · luyện số/ngày/giờ/đánh vần |
| Writing, Speaking | Đề Task 1/Task 2, cue card, ghi âm + chép lời. Nút **🤖 Chấm bằng AI** cho band ước lượng (xem mục dưới) |
| Tài liệu khóa học | Xem docx/pdf/ảnh ngay trên web |

## Giai đoạn 2 — AI chấm Writing / Speaking
1. Lấy key miễn phí: https://aistudio.google.com/apikey
2. Thêm vào `.env.local` (chạy trên máy): `AI_PROVIDER=gemini` và `GEMINI_API_KEY=...`
3. Thêm cùng 2 biến vào Vercel: `npx vercel env add GEMINI_API_KEY production` (và `AI_PROVIDER`), rồi `npx vercel --prod`.
4. Đổi nhà cung cấp: `AI_PROVIDER=groq` + `GROQ_API_KEY`, hoặc `ollama` (chỉ chạy được khi `npm run dev` trên máy bạn).

Key AI chỉ nằm ở server (route `/api/grade`), không bao giờ gửi xuống trình duyệt. Chỉ người đã đăng nhập mới gọi được.
