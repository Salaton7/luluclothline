import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin · Lulu Clothline" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type SidaiProduct = Tables<"sidai_products">;

type FormState = {
  id?: string;
  name: string;
  tag: string;
  price: string;
  description: string;
  image_url: string;
  sizes: string;
  colors: string;
  sort_order: string;
  is_published: boolean;
};

const emptyForm: FormState = {
  name: "",
  tag: "",
  price: "",
  description: "",
  image_url: "",
  sizes: "",
  colors: "",
  sort_order: "0",
  is_published: true,
};

function AdminPage() {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [products, setProducts] = useState<SidaiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const showMessage = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sidai_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      showMessage("err", error.message);
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      setEmail(data.session.user.email ?? null);
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.session.user.id)
        .maybeSingle();
      if (!active) return;
      const adminFlag = !!profile?.is_admin;
      setIsAdmin(adminFlag);
      setAuthChecking(false);
      if (adminFlag) fetchProducts();
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/admin/login" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, fetchProducts]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("sidai-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("sidai-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
      showMessage("ok", "Image uploaded");
    } catch (err: unknown) {
      showMessage("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p: SidaiProduct) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      tag: p.tag ?? "",
      price: String(p.price),
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      sizes: (p.sizes ?? []).join(", "),
      colors: (p.colors ?? []).join(", "),
      sort_order: String(p.sort_order),
      is_published: p.is_published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      tag: form.tag.trim() || null,
      price: parseInt(form.price, 10) || 0,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sort_order: parseInt(form.sort_order, 10) || 0,
      is_published: form.is_published,
    };

    if (!payload.name) {
      showMessage("err", "Name is required");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("sidai_products")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        showMessage("err", error.message);
        return;
      }
      showMessage("ok", "Product updated");
    } else {
      const { error } = await supabase.from("sidai_products").insert(payload);
      if (error) {
        showMessage("err", error.message);
        return;
      }
      showMessage("ok", "Product created");
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabase.from("sidai_products").delete().eq("id", id);
    if (error) {
      showMessage("err", error.message);
      return;
    }
    showMessage("ok", "Product deleted");
    fetchProducts();
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Not authorized</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account ({email}) doesn't have admin access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={handleSignOut}
              className="tracking-luxury rounded-full border border-foreground/30 px-5 py-2 text-[11px] hover:bg-foreground hover:text-background"
            >
              Sign out
            </button>
            <Link
              to="/"
              className="tracking-luxury rounded-full bg-foreground px-5 py-2 text-[11px] text-background"
            >
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">
              Lulu Clothline · Admin
            </p>
            <h1 className="font-display text-2xl">Sidai Collection</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">{email}</span>
            <Link
              to="/sidai"
              className="tracking-luxury rounded-full border border-foreground/30 px-4 py-2 text-[10px] hover:bg-foreground hover:text-background"
            >
              View site
            </Link>
            <button
              onClick={handleSignOut}
              className="tracking-luxury rounded-full bg-foreground px-4 py-2 text-[10px] text-background hover:opacity-90"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        {message && (
          <div
            className={`mb-6 rounded-md p-3 text-sm ${
              message.type === "ok"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* FORM */}
        <section className="mb-12 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-xl">
            {editingId ? "Edit product" : "Add new product"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Tag (e.g. Bridal, Signature)">
              <input
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Price (KSh)">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Sizes (comma separated)" className="md:col-span-2">
              <input
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="XS, S, M, L, XL"
                className={inputCls}
              />
            </Field>
            <Field label="Colors (comma separated)" className="md:col-span-2">
              <input
                value={form.colors}
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
                placeholder="Crimson, Black, Ivory"
                className={inputCls}
              />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls}
              />
            </Field>

            <Field label="Product image" className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4">
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-24 w-24 rounded-md object-cover ring-1 ring-border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="text-sm"
                />
                {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
              </div>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="Or paste an image URL"
                className={`${inputCls} mt-3`}
              />
            </Field>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              <span className="text-sm">Published (visible on Sidai page)</span>
            </label>

            <div className="mt-2 flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="tracking-luxury rounded-full bg-foreground px-6 py-3 text-[11px] text-background hover:opacity-90"
              >
                {editingId ? "Save changes" : "Create product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="tracking-luxury rounded-full border border-foreground/30 px-6 py-3 text-[11px] hover:bg-foreground hover:text-background"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl">All products</h2>
            <p className="text-xs text-muted-foreground">
              {products.length} item{products.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No products yet. Add your first one above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="font-display text-base">{p.name}</p>
                      {p.tag && (
                        <span className="tracking-luxury rounded-full bg-secondary px-2 py-0.5 text-[9px] text-secondary-foreground">
                          {p.tag}
                        </span>
                      )}
                      {!p.is_published && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      KSh {p.price.toLocaleString()} · sort {p.sort_order}
                    </p>
                    {p.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="tracking-luxury rounded-full border border-foreground/30 px-4 py-2 text-[10px] hover:bg-foreground hover:text-background"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="tracking-luxury rounded-full border border-destructive/40 px-4 py-2 text-[10px] text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="tracking-luxury mb-2 block text-[10px] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}