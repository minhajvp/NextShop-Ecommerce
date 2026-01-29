"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, totalPrice, totalItems, loading, updateQty, removeFromCart } =
    useCart();
    

  if (loading) return <p>Loading cart...</p>;

  if (cart.length === 0) return <h1>Your cart is empty</h1>;
  
  

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={`${item.productId}-${item.variantLabel}`}
          

          className="flex items-center gap-4 border p-4 rounded"
        >
          <img
            src={item.image || "/placeholder.png"}
            alt={item.title}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
           
            <h2 className="font-semibold">{item.title}</h2>
            <p>OG Price {item.originalPrice}</p>
            <p>₹ {item.price}</p>
            <p className="text-sm text-gray-500">{item.variantLabel}</p>

          </div>

          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const qty = Math.max(1, Number(e.target.value));
              updateQty(item.productId, qty,item.variantLabel);
            }}
            className="w-16 border px-2"
          />

          <button
            onClick={() => removeFromCart(item.productId,item.variantLabel)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="border-t pt-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Total: ₹ {totalPrice}</h2>
          <p className="text-sm text-gray-500">Items: {totalItems}</p>
        </div>

        <Link
          href="/checkout"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
