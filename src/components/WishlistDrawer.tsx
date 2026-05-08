import { useState } from "react";
import { Heart, X, Trash2, ShoppingBag, Share2, Check, Copy, MessageCircle } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

export function WishlistTrigger({ className = "" }: { className?: string }) {
  const { totalItems, openWishlist } = useWishlist();
  return (
    <button
      type="button"
      onClick={openWishlist}
      aria-label={`Open wishlist (${totalItems} items)`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary ${className}`}
    >
      <Heart className="h-5 w-5" />
      {totalItems > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground"
          aria-hidden="true"
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}

export function WishlistHeartButton({
  item,
  className = "",
}: {
  item: { id: string; name: string; price: number; img?: string };
  className?: string;
}) {
  const { has, toggleItem } = useWishlist();
  const active = has(item.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(item);
      }}
      aria-label={active ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${active ? "fill-accent text-accent" : ""}`}
      />
    </button>
  );
}

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem, totalItems } = useWishlist();
  const { addItem } = useCart();
  const [copied, setCopied] = useState(false);

  const buildShareText = () => {
    const lines = ["My Lulu Clothline wishlist:", ""];
    items.forEach((it) => {
      lines.push(
        `• ${it.name}${it.price > 0 ? ` — KSh ${it.price.toLocaleString()}` : ""}`,
      );
    });
    lines.push("");
    lines.push("Browse: https://luluclothline.com");
    return lines.join("\n");
  };

  const whatsappShareUrl = () =>
    `https://wa.me/?text=${encodeURIComponent(buildShareText())}`;

  const handleNativeShare = async () => {
    const text = buildShareText();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My Lulu Clothline wishlist", text });
        return;
      } catch {
        /* user cancelled — fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div
        onClick={closeWishlist}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Wishlist"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">Saved</p>
            <h2 className="font-display text-2xl">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
              <p className="font-display mt-4 text-2xl">No saved items yet</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Tap the heart on any piece to save it here for later.
              </p>
              <button
                type="button"
                onClick={closeWishlist}
                className="tracking-luxury mt-6 rounded-full border border-foreground/30 px-6 py-3 text-[10px] hover:bg-foreground hover:text-background"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 py-4">
                  {it.img && (
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-muted">
                      <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg leading-tight">{it.name}</h3>
                        {it.price > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            KSh {it.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remove ${it.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            name: it.name,
                            price: it.price,
                            size: "One size",
                            color: "Default",
                            img: it.img,
                          });
                          removeItem(it.id);
                          closeWishlist();
                        }}
                        className="tracking-luxury inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[10px] text-background hover:opacity-90"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move to cart
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-secondary/30 px-5 py-4">
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              Share your wishlist
            </p>
            <div className="flex gap-2">
              <a
                href={whatsappShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-[10px] text-whatsapp-foreground hover:opacity-90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleNativeShare}
                className="tracking-luxury inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/30 px-4 py-3 text-[10px] hover:bg-foreground hover:text-background"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    {typeof navigator !== "undefined" && (navigator as Navigator).share ? (
                      <Share2 className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Share
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}