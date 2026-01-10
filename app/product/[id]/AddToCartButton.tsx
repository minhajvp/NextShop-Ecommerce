"use client"
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Add to Cart
    </button>
  );
}