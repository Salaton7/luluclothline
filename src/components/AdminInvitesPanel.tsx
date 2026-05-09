import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type Invite = {
  id: string;
  token: string;
  email: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

export function AdminInvitesPanel() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const fetchInvites = useCallback(async () => {
    const { data, error } = await supabase
      .from("admin_invites")
      .select("id, token, email, expires_at, used_at, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) flash("err", error.message);
    else setInvites((data ?? []) as Invite[]);
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const inviteUrl = (token: string) =>
    `${window.location.origin}/admin/accept-invite?token=${token}`;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { data: sess } = await supabase.auth.getUser();
    const uid = sess.user?.id;
    if (!uid) {
      flash("err", "Not signed in");
      setLoading(false);
      return;
    }
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("admin_invites").insert({
      email: email.trim().toLowerCase(),
      expires_at: expires,
      created_by: uid,
    });
    setLoading(false);
    if (error) {
      flash("err", error.message);
      return;
    }
    setEmail("");
    flash("ok", "Invite created — copy the link below");
    fetchInvites();
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this invite?")) return;
    const { error } = await supabase.from("admin_invites").delete().eq("id", id);
    if (error) flash("err", error.message);
    else {
      flash("ok", "Invite revoked");
      fetchInvites();
    }
  };

  const copy = async (token: string) => {
    await navigator.clipboard.writeText(inviteUrl(token));
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const status = (inv: Invite) => {
    if (inv.used_at) return { label: "Used", cls: "bg-muted text-muted-foreground" };
    if (new Date(inv.expires_at) < new Date())
      return { label: "Expired", cls: "bg-amber-100 text-amber-800" };
    return { label: "Active", cls: "bg-emerald-100 text-emerald-800" };
  };

  return (
    <section className="mb-12 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl">Admin invites</h2>
        <p className="text-xs text-muted-foreground">
          Time-limited, single-use links to grant admin access by email.
        </p>
      </div>

      {msg && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            msg.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleCreate} className="mt-6 grid gap-3 md:grid-cols-[1fr_140px_auto]">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="invitee@example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value={1}>Expires in 1 day</option>
          <option value={3}>Expires in 3 days</option>
          <option value={7}>Expires in 7 days</option>
          <option value={30}>Expires in 30 days</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="tracking-luxury rounded-full bg-foreground px-6 py-3 text-[11px] text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create invite"}
        </button>
      </form>

      <div className="mt-8">
        {invites.length === 0 ? (
          <p className="text-xs text-muted-foreground">No invites yet.</p>
        ) : (
          <div className="grid gap-3">
            {invites.map((inv) => {
              const s = status(inv);
              const url = inviteUrl(inv.token);
              const isActive = !inv.used_at && new Date(inv.expires_at) >= new Date();
              return (
                <div
                  key={inv.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm">{inv.email}</span>
                    <span className={`tracking-luxury rounded-full px-2 py-0.5 text-[9px] uppercase ${s.cls}`}>
                      {s.label}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      Expires {new Date(inv.expires_at).toLocaleString()}
                    </span>
                  </div>
                  {isActive && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <code className="flex-1 truncate rounded-md bg-muted px-3 py-2 text-[11px]">
                        {url}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(inv.token)}
                        className="tracking-luxury rounded-full border border-foreground/30 px-4 py-2 text-[10px] hover:bg-foreground hover:text-background"
                      >
                        {copied === inv.token ? "Copied!" : "Copy link"}
                      </button>
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRevoke(inv.id)}
                      className="text-[10px] text-destructive hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}