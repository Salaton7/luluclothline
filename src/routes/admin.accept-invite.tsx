import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/accept-invite")({
  head: () => ({
    meta: [
      { title: "Accept admin invite · Lulu Clothline" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
  component: AcceptInvitePage,
});

type Phase = "loading" | "needs_auth" | "redeeming" | "success" | "error";

function AcceptInvitePage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const errorMessage = (code: string) => {
    switch (code) {
      case "invalid_token":
        return "This invite link is invalid.";
      case "expired":
        return "This invite has expired. Ask an admin for a new one.";
      case "already_used":
        return "This invite has already been used.";
      case "email_mismatch":
        return "Your account email doesn't match the invited email. Sign in with the invited address.";
      case "not_authenticated":
        return "Please sign in or create an account to accept the invite.";
      default:
        return "Could not redeem invite.";
    }
  };

  const redeem = async () => {
    setPhase("redeeming");
    const { data, error: rpcErr } = await supabase.rpc("redeem_admin_invite", {
      _token: token,
    });
    if (rpcErr) {
      setError(rpcErr.message);
      setPhase("error");
      return;
    }
    const result = data as { ok: boolean; error?: string } | null;
    if (result?.ok) {
      setPhase("success");
      setTimeout(() => navigate({ to: "/admin" }), 1500);
    } else {
      setError(errorMessage(result?.error ?? "unknown"));
      setPhase("error");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Missing invite token.");
      setPhase("error");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        redeem();
      } else {
        setPhase("needs_auth");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/accept-invite?token=${token}`,
          },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await redeem();
      } else {
        setError("Check your email to confirm your address, then click the invite link again.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md">
        <Link to="/" className="tracking-luxury text-[10px] text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
            Lulu Clothline · Admin invite
          </p>

          {phase === "loading" || phase === "redeeming" ? (
            <>
              <h1 className="font-display text-3xl">Verifying invite…</h1>
              <p className="mt-2 text-sm text-muted-foreground">One moment.</p>
            </>
          ) : phase === "success" ? (
            <>
              <h1 className="font-display text-3xl">You're an admin</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Redirecting you to the admin dashboard…
              </p>
            </>
          ) : phase === "error" ? (
            <>
              <h1 className="font-display text-3xl">Invite problem</h1>
              <p className="mt-2 text-sm text-destructive">{error}</p>
              <Link
                to="/admin/login"
                className="tracking-luxury mt-6 inline-block rounded-full border border-foreground/30 px-5 py-2 text-[11px] hover:bg-foreground hover:text-background"
              >
                Go to admin login
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl">
                {mode === "signup" ? "Create your admin account" : "Sign in to accept invite"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the email address this invite was sent to.
              </p>

              <form onSubmit={handleAuth} className="mt-8 space-y-4">
                <div>
                  <label className="tracking-luxury mb-2 block text-[10px] text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="tracking-luxury mb-2 block text-[10px] text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {error && (
                  <p className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="tracking-luxury w-full rounded-full bg-foreground py-3 text-[11px] text-background hover:opacity-90 disabled:opacity-50"
                >
                  {busy
                    ? "Please wait…"
                    : mode === "signup"
                      ? "Create account & accept invite"
                      : "Sign in & accept invite"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                {mode === "signup"
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}