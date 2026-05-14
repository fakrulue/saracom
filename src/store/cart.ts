import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartLine[];
  isOpen: boolean;
  add: (line: CartLine) => void;
  remove: (productId: string, size?: string) => void;
  setQty: (productId: string, qty: number, size?: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: () => number;
  subtotal: () => number;
};

const sameLine = (a: CartLine, b: { productId: string; size?: string }) =>
  a.productId === b.productId && (a.size ?? "") === (b.size ?? "");

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (line) =>
        set((s) => {
          const idx = s.items.findIndex((i) => sameLine(i, line));
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], qty: next[idx].qty + line.qty };
            return { items: next, isOpen: true };
          }
          return { items: [...s.items, line], isOpen: true };
        }),
      remove: (productId, size) =>
        set((s) => ({ items: s.items.filter((i) => !sameLine(i, { productId, size })) })),
      setQty: (productId, qty, size) =>
        set((s) => ({
          items: s.items
            .map((i) => (sameLine(i, { productId, size }) ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    { name: "cg-cart" },
  ),
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "cg-wishlist" },
  ),
);
