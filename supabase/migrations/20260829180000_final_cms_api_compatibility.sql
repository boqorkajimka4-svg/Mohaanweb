-- Final compatibility fix for the existing Mohaan Web API.

-- CATEGORIES
alter table public.categories
    add column if not exists image_url text;

alter table public.categories
    add column if not exists sort_order integer default 0;

-- NAVIGATION
alter table public.nav_items
    add column if not exists active boolean default true;

-- HOME SECTIONS
alter table public.home_sections
    add column if not exists type text;

alter table public.home_sections
    add column if not exists content jsonb default '{}'::jsonb;

alter table public.home_sections
    add column if not exists active boolean default true;

-- SETTINGS
-- The API explicitly reads the singleton row id=1.
insert into public.site_settings (id, key, value)
values (1, 'site_settings', '{}')
on conflict (id) do nothing;

-- Ensure defaults are present for existing records.
update public.categories
set sort_order = 0
where sort_order is null;

update public.nav_items
set active = true
where active is null;

update public.home_sections
set active = true
where active is null;

update public.home_sections
set content = '{}'::jsonb
where content is null;

-- Refresh PostgREST schema cache.
notify pgrst, 'reload schema';
