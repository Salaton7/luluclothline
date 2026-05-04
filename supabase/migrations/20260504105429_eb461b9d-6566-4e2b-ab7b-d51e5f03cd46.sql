
-- Lock search_path on trigger helper
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- Revoke direct API execute on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Restrict bucket listing: only admins can list; viewing single objects via public URL still works
DROP POLICY IF EXISTS "Anyone can view Sidai images" ON storage.objects;

CREATE POLICY "Admins can list Sidai images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sidai-images' AND public.is_admin(auth.uid()));
