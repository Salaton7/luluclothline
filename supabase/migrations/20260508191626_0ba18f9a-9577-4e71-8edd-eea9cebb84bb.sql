ALTER TABLE public.sidai_products
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'sidai';

ALTER TABLE public.sidai_products
DROP CONSTRAINT IF EXISTS sidai_products_category_check;

ALTER TABLE public.sidai_products
ADD CONSTRAINT sidai_products_category_check
CHECK (category IN ('sidai', 'textile', 'collective'));

CREATE INDEX IF NOT EXISTS sidai_products_category_idx
ON public.sidai_products (category);