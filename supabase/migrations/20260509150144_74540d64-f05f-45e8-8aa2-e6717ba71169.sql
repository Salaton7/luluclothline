-- Admin invite tokens
CREATE TABLE public.admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMPTZ,
  used_by UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_invites_token ON public.admin_invites(token);
CREATE INDEX idx_admin_invites_email ON public.admin_invites(lower(email));

ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Only admins can view / create / delete invites
CREATE POLICY "Admins can view invites"
  ON public.admin_invites FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create invites"
  ON public.admin_invites FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Admins can delete invites"
  ON public.admin_invites FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Redeem function: caller must be authenticated, email must match, token valid & unused & unexpired
CREATE OR REPLACE FUNCTION public.redeem_admin_invite(_token UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite public.admin_invites%ROWTYPE;
  _user_email TEXT;
  _uid UUID := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  SELECT email INTO _user_email FROM auth.users WHERE id = _uid;

  SELECT * INTO _invite FROM public.admin_invites WHERE token = _token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_token');
  END IF;

  IF _invite.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_used');
  END IF;

  IF _invite.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  IF lower(_invite.email) <> lower(_user_email) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'email_mismatch');
  END IF;

  UPDATE public.profiles SET is_admin = true WHERE id = _uid;
  UPDATE public.admin_invites
    SET used_at = now(), used_by = _uid
    WHERE id = _invite.id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_admin_invite(UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.redeem_admin_invite(UUID) TO authenticated;