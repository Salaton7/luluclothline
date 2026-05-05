import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
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
          <button
            type="button"
            onClick={clear}
            className="tracking-luxury rounded-full border border-border px-4 py-2 text-[10px] text-muted-foreground hover:border-foreground/60 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Your wishlist is empty.</p>
          <Link
            to="/sidai"
            className="tracking-luxury mt-6 inline-flex items-center gap-1.5 rounded-full border border-foreground/30 px-4 py-2 text-[10px] hover:bg-foreground hover:text-background"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border/60">
            {items.map((it) => (
              <li key={it.id} className="flex gap-4 py-6">
                <div className="h-32 w-24 shrink-0 overflow-hidden bg-muted ring-1 ring-foreground/10">
                  {it.img ? (
                    <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg leading-tight">{it.name}</h2>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      aria-label="Remove"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {it.desc && (
                    <p className="mt-1 text-xs text-muted-foreground">{it.desc}</p>
                  )}
                  <p className="mt-2 text-sm">
                    KSh {it.price.toLocaleString()}
                    {it.quantity > 1 && (
                      <span className="ml-1 text-muted-foreground">
                        · KSh {(it.price * it.quantity).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => decrement(it.id)}
                        aria-label="Decrease quantity"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
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
                  </div>
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