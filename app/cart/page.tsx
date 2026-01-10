"use client";

import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty,totalPrice } = useCart();

  if (cart.length === 0) {
    return <h1>Your cart is empty</h1>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-4 border p-4 rounded"
        >
          <img src={item.image} className="w-20" />

          <div className="flex-1">
            <h2 className="font-semibold">{item.title}</h2>
            <p>₹ {item.price}</p>
          </div>

          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              updateQty(item._id, Number(e.target.value))
            }
            className="w-16 border px-2"
          />

          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="border-t pt-4 flex justify-between items-center">
  <h2 className="text-xl font-bold">
    Total: ₹ {totalPrice}
  </h2>

  <button className="px-4 py-2 bg-green-600 text-white rounded">
    Checkout
  </button>
</div>
    </div>
  );
}
