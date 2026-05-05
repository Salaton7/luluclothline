import * as React from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
  desc?: string;
  quantity: number;
};

type WishlistContextValue = {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: Omit<WishlistItem, "quantity"> & { quantity?: number }) => void;
  add: (item: Omit<WishlistItem, "quantity"> & { quantity?: number }) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalItems: number;
  totalUnique: number;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "lulu-wishlist-v1";

export const wishlistId = (name: string) => name.toLowerCase().trim();

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((p: WishlistItem) => ({
              ...p,
              quantity: typeof p.quantity === "number" && p.quantity > 0 ? p.quantity : 1,
            })),
          );
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const has = (id: string) => items.some((i) => i.id === id);

  const toggle: WishlistContextValue["toggle"] = (item) => {
    setItems((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, { ...item, quantity: item.quantity ?? 1 }],
    );
  };

  const add: WishlistContextValue["add"] = (item) => {
    const qty = item.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const setQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)),
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0),
    );

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const value: WishlistContextValue = {
    items,
    has,
    toggle,
    add,
    setQuantity,
    increment,
    decrement,
    remove,
    clear,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalUnique: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}