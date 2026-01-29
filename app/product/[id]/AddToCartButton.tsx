"use client"
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product,disabled=false,variantLabel }: { product: any,disabled?:boolean,variantLabel:string }) {
  const { addToCart } = useCart();
  const router = useRouter()
  

  const handleAdd = async () => {
    await addToCart({
      productId: product._id.toString(),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    },variantLabel);

    router.push("/cart"); // ✅ after cart update
  };

  return (
    <button disabled={disabled} onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
      {disabled ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}