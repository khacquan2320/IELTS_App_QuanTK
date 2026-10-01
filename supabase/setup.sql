-- Chạy 1 lần trong Supabase: Dashboard → SQL Editor → New query → dán toàn bộ → Run

-- 1. Bảng lưu tiến độ học, mỗi tài khoản 1 dòng
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

drop policy if exists "own progress select" on public.progress;
drop policy if exists "own progress insert" on public.progress;
drop policy if exists "own progress update" on public.progress;

-- Mỗi người chỉ đọc/ghi được tiến độ của chính mình
create policy "own progress select" on public.progress for select to authenticated using (auth.uid() = user_id);
create policy "own progress insert" on public.progress for insert to authenticated with check (auth.uid() = user_id);
create policy "own progress update" on public.progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. Kho tài liệu khóa học (riêng tư, giới hạn 50MB/file)
insert into storage.buckets (id, name, public, file_size_limit)
values ('materials', 'materials', false, 52428800)
on conflict (id) do nothing;

-- Chỉ người đã đăng nhập mới xem được tài liệu (việc tải lên dùng service role key nên không cần policy ghi)
drop policy if exists "logged-in users read materials" on storage.objects;
create policy "logged-in users read materials" on storage.objects for select to authenticated using (bucket_id = 'materials');
