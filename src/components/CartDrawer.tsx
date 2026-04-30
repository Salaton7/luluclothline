import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart, buildWhatsAppCheckoutUrl } from "@/lib/cart";

export function CartTrigger({ className = "" }: { className?: string }) {
  const { totalItems, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart (${totalItems} items)`}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
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

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCart();

  const checkoutUrl = buildWhatsAppCheckoutUrl(items, totalPrice);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">Your Bag</p>
            <h2 className="font-display text-2xl">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <p className="font-display mt-4 text-2xl">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Browse the collection and add pieces you love.
              </p>
              <button
                type="button"
                onClick={closeCart}
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
                      <img
                        src={it.img}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg leading-tight">
                          {it.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Size: {it.size} · Color: {it.color}
                        </p>
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
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.id, it.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.id, it.quantity + 1)}
                          aria-label="Increase quantity"
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm tabular-nums">
                        KSh {(it.price * it.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border/60 bg-secondary/30 px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="tracking-luxury text-[10px] text-muted-foreground">
                Total
              </span>
              <span className="font-display text-3xl tabular-nums">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeCart}
              className="tracking-luxury mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-[11px] text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.02]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Checkout via WhatsApp
            </a>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure checkout via WhatsApp. Pay easily with M-Pesa.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}