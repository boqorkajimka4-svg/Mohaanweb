ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
