"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";


export default function BuyNowButton({ productId,variantLabel,disabled }: { productId: string,variantLabel:string,disabled?:boolean }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleBuyNow = () => {
    console.log(user)
    if (user===null) {
      router.push(`/login?redirect=/product/${productId}`);
      return;
    }

    router.push(`/checkout?mode=buynow&productId=${productId}&variant=${variantLabel}&qty=1`);
  };

  return (
    <button onClick={handleBuyNow} className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg ">
      Buy Now
    </button>
  );
}
