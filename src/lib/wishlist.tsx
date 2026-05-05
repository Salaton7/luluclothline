import * as React from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
  desc?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalItems: number;
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
        if (Array.isArray(parsed)) setItems(parsed);
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

  const toggle = (item: WishlistItem) => {
    setItems((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item],
    );
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const value: WishlistContextValue = {
    items,
    has,
    toggle,
    remove,
    clear,
    totalItems: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}