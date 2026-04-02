-- Run in Supabase SQL editor or via CLI.
-- 1) Extend upcoming events for announcements (banner, time, location).
-- 2) Gallery items table for admin-managed photos.
-- 3) Create a public Storage bucket named `media` (or set SUPABASE_STORAGE_BUCKET) with public read.

alter table public.upcoming_events
  add column if not exists banner_url text,
  add column if not exists event_time text,
  add column if not exists location text;

create table if not exists public.gallery_items (
  id bigint generated always as identity primary key,
  image_url text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Allow anonymous read for the live site (matches existing public.events pattern).
alter table public.gallery_items enable row level security;

create policy "Public read gallery_items"
  on public.gallery_items for select
  using (true);

-- Optional: tighten insert/update/delete to service role only (API uses service_role key and bypasses RLS).
-- If your project restricts service role, add policies for authenticated admins instead.
