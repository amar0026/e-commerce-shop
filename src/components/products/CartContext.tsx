import  { createContext, useContext, useState, } from "react";
import type { ReactNode } from "react";
/* ── CartItem ── */
export interface CartItem {
  id:            number;
  name:          string;
  cat:           string;
  sub:           string;
  price:         number;
  orig:          number;
  img:           string;
  badge:         string;
  badgeColor:    string;
  fabric:        string;
  colors:        string[];
  sizes:         string[];
  rating:        number;
  reviews:       number;
  qty:           number;
  selectedSize:  string;
  selectedColor: string;
}

export interface CartContextType {
  items:         CartItem[];
  addItem:       (product: Omit<CartItem, "qty" | "selectedSize" | "selectedColor">, size: string, color: string) => void;
  removeItem:    (id: number) => void;
  updateQty:     (id: number, qty: number) => void;
  clearCart:     () => void;
  totalItems:    number;
  totalPrice:    number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (
    product: Omit<CartItem, "qty" | "selectedSize" | "selectedColor">,
    size: string,
    color: string
  ) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.selectedSize === size ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, getTotalItems: () => totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  return ctx;
}