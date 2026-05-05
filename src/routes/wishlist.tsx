import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Heart, Trash2, Minus, Plus, ShoppingBag, Share2, Check, Copy, MessageCircle } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Lulu Clothline" },
      {
        name: "description",
        content: "All the pieces you've saved from Lulu Clothline, with prices and quantities.",
      },
      { property: "og:title", content: "Your Wishlist — Lulu Clothline" },
      {
        property: "og:description",
        content: "All the pieces you've saved from Lulu Clothline, with prices and quantities.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove, clear, increment, decrement, totalItems } = useWishlist();
  const { addItem } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = "My Lulu Clothline wishlist";
  const shareText = items.length
    ? `Check out my Lulu Clothline wishlist:\n\n${items
        .map((i) => `• ${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""} — KSh ${i.price.toLocaleString()}`)
        .join("\n")}\n\nTotal: KSh ${subtotal.toLocaleString()}\n${shareUrl}`
    : `Check out Lulu Clothline: ${shareUrl}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or unsupported — fall through to dialog
      }
    }
    setShareOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
      <header className="mb-10 flex items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="tracking-luxury text-[10px] text-muted-foreground">Saved for later</p>
          <h1 className="font-display text-3xl md:text-4xl">
            Wishlist {totalItems > 0 && <span className="text-muted-foreground">({totalItems})</span>}
          </h1>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="tracking-luxury inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[10px] text-background hover:opacity-90"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
            <button
              type="button"
              onClick={clear}
              className="tracking-luxury rounded-full border border-border px-4 py-2 text-[10px] text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </header>

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            aria-label="Close share"
            onClick={() => setShareOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-label="Share wishlist"
            className="relative w-full max-w-md rounded-t-2xl bg-background p-6 shadow-xl sm:rounded-2xl"
          >
            <p className="tracking-luxury text-[10px] text-muted-foreground">Share with friends</p>
            <h2 className="mt-1 font-display text-xl">Send your wishlist</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick how you'd like to share these {totalItems} {totalItems === 1 ? "piece" : "pieces"}.
            </p>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span className="text-[10px] text-muted-foreground">WhatsApp</span>
              </a>
              <a
                href={xHref}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold transition-colors group-hover:bg-foreground group-hover:text-background">
                  𝕏
                </span>
                <span className="text-[10px] text-muted-foreground">Twitter</span>
              </a>
              <a
                href={fbHref}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-base transition-colors group-hover:bg-foreground group-hover:text-background">
                  f
                </span>
                <span className="text-[10px] text-muted-foreground">Facebook</span>
              </a>
              <a
                href={mailHref}
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-xs transition-colors group-hover:bg-foreground group-hover:text-background">
                  @
                </span>
                <span className="text-[10px] text-muted-foreground">Email</span>
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-secondary/40 p-1 pl-4">
              <span className="flex-1 truncate text-xs text-muted-foreground">{shareUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="tracking-luxury inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-[10px] text-background hover:opacity-90"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShareOpen(false)}
              className="tracking-luxury mt-4 w-full rounded-full border border-border px-4 py-2.5 text-[10px] text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/30 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-5 font-display text-xl">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Tap the heart on any piece you love to save it here for later.
          </p>
          <Link
            to="/sidai"
            className="tracking-luxury mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[10px] text-background hover:opacity-90"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-foreground/30 hover:bg-secondary/40 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10 sm:h-24 sm:w-20">
                  {it.img ? (
                    <img
                      src={it.img}
                      alt={it.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <h2 className="font-display text-base leading-tight sm:text-lg">{it.name}</h2>
                  {it.desc && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{it.desc}</p>
                  )}
                  <p className="mt-1 text-sm">
                    KSh {it.price.toLocaleString()}
                    {it.quantity > 1 && (
                      <span className="ml-1 text-muted-foreground">
                        · KSh {(it.price * it.quantity).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div className="mt-2 inline-flex w-fit items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => decrement(it.id)}
                      aria-label="Decrease quantity"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-7 text-center text-xs tabular-nums">
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(it.id)}
                      aria-label="Increase quantity"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        name: it.name,
                        price: it.price,
                        size: "One size",
                        color: "Default",
                        img: it.img,
                        quantity: it.quantity,
                      });
                      remove(it.id);
                    }}
                    className="tracking-luxury inline-flex items-center gap-1.5 rounded-full border border-foreground/30 px-3 py-1.5 text-[10px] hover:bg-foreground hover:text-background"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    aria-label="Remove from wishlist"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border/60 p-6 md:sticky md:top-24">
            <p className="tracking-luxury text-[10px] text-muted-foreground">Summary</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="tabular-nums">{totalItems}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl">KSh {subtotal.toLocaleString()}</span>
            </div>
            <Link
              to="/sidai"
              className="tracking-luxury mt-6 inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-3 text-[10px] hover:border-foreground/60"
            >
              Continue browsing
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}