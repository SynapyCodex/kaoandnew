-- =======================================================
-- SQL Setup สำหรับ Supabase Cloud Database (เว็บคู่รัก)
-- นำโค้ดนี้ไปวางในเมนู SQL Editor บน Supabase แล้วกด RUN
-- =======================================================

-- 1. สร้างตารางจัดเก็บข้อมูลคู่รัก
create table if not exists couple_store (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. เปิดใช้งาน Row Level Security (RLS) เพื่ออนุญาตให้แอปอ่านและเขียนข้อมูลได้
alter table couple_store enable row level security;

-- นโยบายเปิดให้อ่านข้อมูล
create policy "Allow public read" on couple_store
  for select using (true);

-- นโยบายเปิดให้เพิ่มข้อมูล
create policy "Allow public insert" on couple_store
  for insert with check (true);

-- นโยบายเปิดให้อัปเดตข้อมูล
create policy "Allow public update" on couple_store
  for update using (true);

-- 3. เปิดระบบ Realtime (ซิงค์อัตโนมัติทันทีที่อีกฝ่ายกดทำอะไร โดยไม่ต้องรีเฟรช)
alter publication supabase_realtime add table couple_store;
