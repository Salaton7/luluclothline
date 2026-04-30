import * as React from "react";

export type CartItem = {
  id: string; // unique key: name|size|color
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  img?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lulu-cart-v1";

const makeId = (name: string, size: string, color: string) =>
  `${name}|${size}|${color}`.toLowerCase();

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage
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

  // Persist to localStorage
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item) => {
    const qty = item.quantity ?? 1;
    const id = makeId(item.name, item.size, item.color);
    setItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        return prev.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [
        ...prev,
        {
          id,
          name: item.name,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: qty,
          img: item.img,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p)),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((v) => !v),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function buildWhatsAppCheckoutUrl(items: CartItem[], totalPrice: number) {
  const lines: string[] = ["Hi, I want to place an order from Lulu Clothline:", ""];
  items.forEach((it) => {
    lines.push(`- Product: ${it.name}`);
    lines.push(`  Size: ${it.size}`);
    lines.push(`  Color: ${it.color}`);
    lines.push(`  Quantity: ${it.quantity}`);
    lines.push(`  Price: KSh ${it.price.toLocaleString()}`);
    lines.push("");
  });
  lines.push(`Total: KSh ${totalPrice.toLocaleString()}`);
  lines.push("");
  lines.push("Please confirm availability and delivery.");
  return `https://wa.me/254714844809?text=${encodeURIComponent(lines.join("\n"))}`;
}