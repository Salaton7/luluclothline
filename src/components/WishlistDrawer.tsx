import * as React from "react";
import { Heart, X, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist, wishlistId, type WishlistItem } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

export function WishlistTrigger({ className = "" }: { className?: string }) {
  const { totalItems } = useWishlist();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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
      <WishlistDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function WishlistButton({ item }: { item: Omit<WishlistItem, "id"> }) {
  const { has, toggle } = useWishlist();
  const id = wishlistId(item.name);
  const active = has(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ id, ...item });
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-105"
    >
      <Heart
        className={`h-4 w-4 transition-colors ${active ? "fill-accent stroke-accent" : ""}`}
      />
    </button>
  );
}

function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, clear, totalItems } = useWishlist();
  const { addItem } = useCart();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close wishlist"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-label="Wishlist"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">Saved for later</p>
            <h2 className="font-display text-2xl">Wishlist ({totalItems})</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Heart className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Your wishlist is empty.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap the heart on any piece to save it here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 py-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-muted ring-1 ring-foreground/10">
                    {it.img ? (
                      <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base leading-tight">{it.name}</h3>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        aria-label="Remove"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      KSh {it.price.toLocaleString()}
                    </p>
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
                        remove(it.id);
                      }}
                      className="tracking-luxury mt-auto inline-flex items-center gap-1.5 self-start rounded-full border border-foreground/30 px-3 py-1.5 text-[10px] hover:bg-foreground hover:text-background"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Move to cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 px-5 py-4">
            <button
              type="button"
              onClick={clear}
              className="tracking-luxury w-full rounded-full border border-border px-4 py-3 text-[10px] text-muted-foreground hover:border-foreground/60 hover:text-foreground"
            >
              Clear wishlist
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}