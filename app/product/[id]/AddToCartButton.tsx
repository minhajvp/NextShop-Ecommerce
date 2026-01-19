"use client"
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const router = useRouter()

  return (
    <button
      onClick={async() =>{
        await addToCart(productId,1)
        router.push("/cart");}
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Add to Cart
    </button>
  );
}