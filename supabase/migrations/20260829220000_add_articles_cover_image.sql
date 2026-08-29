alter table public.articles
add column if not exists cover_image text;

notify pgrst, 'reload schema';
