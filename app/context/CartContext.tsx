"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    setLoading(true);
    const res = await fetch("/api/cart", { cache: "no-store" });

    if (!res.ok) {
      setCart([]);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setCart(data.cart.items || []);
    setLoading(false);
  }

  async function addToCart(productId: string, qty = 1) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty }),
    });

    if (res.ok) {
      const data = await res.json();
      setCart(data.cart.items || []);
    }
  }

  async function updateQty(productId: string, qty: number) {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty }),
    });

    if (res.ok) {
      const data = await res.json();
      setCart(data.cart.items || []);
    }
  }

  async function removeFromCart(productId: string) {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const data = await res.json();
      setCart(data.cart.items || []);
    }
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        loading,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
