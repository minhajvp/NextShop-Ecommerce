"use client";

import { CartItem } from "@/types/cart";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
    cart:CartItem[]
    addToCart:(Item:CartItem)=>void
    removeFromCart:(id:string)=>void
    updateQty:(id:string,qty:number)=>void
    totalPrice:number
    totalItems:number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({children}:{children:React.ReactNode}){
    const [cart,setCart] = useState<CartItem[]>([])

    useEffect(()=>{
        const stored = localStorage.getItem("cart")
        if (stored) setCart(JSON.parse(stored))
    },[])

    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))

    },[cart])

    function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        return prev.map((p) =>
          p._id === item._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, item];
    });
  }
    function removeFromCart(id:string){
        setCart((prev)=>prev.filter((p)=>p._id!==id))
    }

    function updateQty(id: string, qty: number) {
    setCart((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, quantity: qty } : p
      )
    );
  }
  const totalItems = cart.reduce((sum,item)=>sum+item.quantity,0)
  const totalPrice = cart.reduce((sum,item)=>sum+(item.quantity*item.price),0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty,totalItems, totalPrice}}
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