
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = _user_id), false);
$$;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile (non-admin fields)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup; first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, display_name, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    user_count = 0
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SIDAI PRODUCTS ============
CREATE TABLE public.sidai_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sidai_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published Sidai products"
  ON public.sidai_products FOR SELECT
  USING (is_published OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert Sidai products"
  ON public.sidai_products FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update Sidai products"
  ON public.sidai_products FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete Sidai products"
  ON public.sidai_products FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER sidai_products_updated_at
  BEFORE UPDATE ON public.sidai_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('sidai-images', 'sidai-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view Sidai images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sidai-images');

CREATE POLICY "Admins can upload Sidai images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sidai-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update Sidai images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'sidai-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete Sidai images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'sidai-images' AND public.is_admin(auth.uid()));
