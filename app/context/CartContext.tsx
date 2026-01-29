
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type CartItem = {
  productId: string;
  title: string;
  originalPrice?:number;
  
  price: number;
  image?: string;
  variantLabel?:string,

  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;

  addToCart: (item: CartItem, variantLabel?: string) => Promise<void>;
  updateQty: (productId: string, qty: number, variantLabel?: string) => Promise<void>;
  removeFromCart: (productId: string, variantLabel?: string) => Promise<void>;
  fetchDbCart:() => Promise<void>

  syncLocalCartToDb: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [dbCart, setDbCart] = useState<CartItem[]>([]);
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load local cart (Guest cart)
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setLocalCart(JSON.parse(stored));
  }, []);

  // ✅ Save local cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  // ✅ Fetch DB cart only when logged in
  async function fetchDbCart() {
    setLoading(true);
    const res = await fetch("/api/cart", { cache: "no-store" });

    if (!res.ok) {
      setDbCart([]);
      setLoading(false);
      return;
    }

    const data = await res.json();
    
    setDbCart(data.cart?.items || data.items || []);
    setLoading(false);
  }

  // ✅ Sync local cart -> DB after login
  async function syncLocalCartToDb() {
    if (!user) return;
    if (localCart.length === 0) {
      // no items to sync, just fetch db cart
      await fetchDbCart();
      return;
    }

    // send all local items to backend
    await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: localCart }),
    });

    // refresh db cart
    await fetchDbCart();

    // clear local cart after syncing
    setLocalCart([]);
    localStorage.removeItem("cart");
  }

  // ✅ When user changes (login/logout)
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // logged in -> sync local cart (which fetches db cart inside)
      syncLocalCartToDb();
    } else {
      // logged out -> reset db cart
      setDbCart([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  // ✅ For guest users, set loading to false after component mounts
  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  // ✅ Add to cart (Smart: guest vs logged)
  async function addToCart(item: CartItem,variantLabel = "default") {
    if (!user) {
      // Guest -> local cart
      setLocalCart((prev) => {
        const existing = prev.find((p) => p.productId === item.productId);

        if (existing) {
          return prev.map((p) =>
            p.productId === item.productId
              ? { ...p, quantity: p.quantity + item.quantity}
              : p
          );
        }

        return [...prev, item];
      });
      return;
    }

    // Logged -> DB cart
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId, quantity: item.quantity ,variantLabel:variantLabel}),
    });
    console.log( "context",{productId: item.productId, quantity: item.quantity ,variantLabel:variantLabel})

    if (res.ok) {
      const data = await res.json();
      
      setDbCart(data.cart.items || []);
     
    }else{
      const data = await res.json();
      console.log(data)
    }
    
  }

  async function updateQty(productId: string, qty: number,variantLabel = "default") {
    if (!user) {
      setLocalCart((prev) =>
        prev.map((p) => (p.productId === productId && p.variantLabel === variantLabel? { ...p, quantity: qty } : p))
      );
      return;
    }

    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty,variantLabel:variantLabel }),
    });

    if (res.ok) {
      const data = await res.json();
      setDbCart(data.cart?.items || data.items || []);
    }
  }

  async function removeFromCart(productId: string,variantLabel = "default") {
    if (!user) {
      setLocalCart((prev) => prev.filter((p) => p.productId !== productId));
      return;
    }

    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId ,variantLabel}),
    });

    if (res.ok) {
      const data = await res.json();
      setDbCart(data.cart?.items || data.items || []);
    }
  }

  // ✅ Active cart based on user login
  const cart = user ? dbCart : localCart;

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        fetchDbCart,
        syncLocalCartToDb,
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



