import * as React from "react";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  totalItems: number;
};

const WishlistContext = React.createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "lulu-wishlist-v1";

export const wishlistId = (name: string) => name.toLowerCase().trim();

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const has = (id: string) => items.some((i) => i.id === id);

  const toggleItem: WishlistContextValue["toggleItem"] = (item) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        return prev.filter((p) => p.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const value: WishlistContextValue = {
    items,
    isOpen,
    openWishlist: () => setIsOpen(true),
    closeWishlist: () => setIsOpen(false),
    toggleItem,
    removeItem,
    clear: () => setItems([]),
    has,
    totalItems: items.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}