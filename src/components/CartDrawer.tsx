import * as React from "react";
import { ShoppingBag, X, Plus, Minus, Trash2, Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";

const MPESA_BUSINESS_NAME = "Lulu Clothline";
const MPESA_PAYBILL = "247247";
const MPESA_ACCOUNT_NUMBER = "0714844809";

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
    clearCart,
  } = useCart();

  const [payOpen, setPayOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

  const openPayment = () => {
    setCode("");
    setStatus("idle");
    setPayOpen(true);
  };
  const closePayment = () => {
    if (status === "loading") return;
    setPayOpen(false);
  };
  const handleConfirm = () => {
    if (!code.trim()) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        clearCart();
        setPayOpen(false);
        closeCart();
      }, 2200);
    }, 1500);
  };

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
            <button
              type="button"
              onClick={openPayment}
              className="tracking-luxury mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-mpesa px-6 py-4 text-[11px] text-mpesa-foreground shadow-lg transition-transform hover:scale-[1.02]"
            >
              Lipa na M-Pesa
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure M-Pesa payment. Pay via Paybill in seconds.
            </p>
          </div>
        )}
      </aside>
      <MpesaPaymentModal
        open={payOpen}
        onClose={closePayment}
        amount={totalPrice}
        code={code}
        setCode={setCode}
        status={status}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function MpesaPaymentModal({
  open,
  onClose,
  amount,
  orderId,
  code,
  setCode,
  status,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  code: string;
  setCode: (v: string) => void;
  status: "idle" | "loading" | "success";
  onConfirm: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Complete Payment"
        aria-hidden={!open}
        className={`fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border/60">
          {status !== "loading" && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {status === "success" ? (
            <div className="flex flex-col items-center px-8 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mpesa/15 text-mpesa">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="font-display mt-5 text-3xl">Payment received</h3>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                We'll begin processing your order. A confirmation will be sent shortly.
              </p>
            </div>
          ) : (
            <div className="px-7 py-7">
              <p className="tracking-luxury text-[10px] text-muted-foreground">M-Pesa</p>
              <h3 className="font-display mt-1 text-3xl">Complete Payment</h3>

              <div className="mt-6 rounded-xl bg-secondary/50 p-5">
                <DetailRow label="Business" value={MPESA_BUSINESS_NAME} />
                <Divider />
                <DetailRow label="Paybill Number" value={MPESA_PAYBILL} mono />
                <Divider />
                <DetailRow label="Account Number" value={orderId} mono />
                <Divider />
                <DetailRow
                  label="Amount"
                  value={`KSh ${amount.toLocaleString()}`}
                  emphasize
                />
              </div>

              <div className="mt-6">
                <p className="tracking-luxury text-[10px] text-muted-foreground">
                  How to pay
                </p>
                <ol className="mt-3 space-y-1.5 text-sm text-foreground/80">
                  <Step n={1}>Open M-Pesa on your phone</Step>
                  <Step n={2}>Select Lipa na M-Pesa</Step>
                  <Step n={3}>Choose Pay Bill and enter {MPESA_PAYBILL}</Step>
                  <Step n={4}>Enter Account Number {orderId}</Step>
                  <Step n={5}>Enter Amount KSh {amount.toLocaleString()}</Step>
                  <Step n={6}>Enter your PIN and confirm</Step>
                </ol>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="mpesa-code"
                  className="tracking-luxury text-[10px] text-muted-foreground"
                >
                  Enter M-Pesa Confirmation Code
                </label>
                <input
                  id="mpesa-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 16))}
                  placeholder="e.g. QKX123ABC"
                  disabled={status === "loading"}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm tracking-wider outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
                />
              </div>

              <button
                type="button"
                onClick={onConfirm}
                disabled={!code.trim() || status === "loading"}
                className="tracking-luxury mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mpesa px-6 py-4 text-[11px] text-mpesa-foreground shadow-lg transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  mono,
  emphasize,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`${mono ? "font-mono" : ""} ${
          emphasize ? "font-display text-xl" : "text-sm"
        } tabular-nums`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border/60" />;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="tracking-luxury mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}