"use client"
import AddToCartButton from '@/app/product/[id]/AddToCartButton';
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    product:any
}

export default function ProductCard({ product }: Props) {
  const variants = product.variants || [];
   const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedVariant = variants[selectedIndex];
  
    // fallback if no variants exist
    
    const variantLabel = selectedVariant?.label ?? "default";
    
    
  return (
    <Link href={`/product/${product._id}`}>
    <div className="border rounded-xl p-4 bg-white hover:shadow-lg hover:-translate-y-1 transition">

        
      <img
        src={product.image?.[0]}
        alt={product.title}
        className="rounded-lg mb-3 w-full h-48 object-cover"
      />

      <h3 className="font-semibold">{product.title}</h3>

      <p className="text-gray-600">₹ {product.price}</p>

      <AddToCartButton product={product} variantLabel={variantLabel}></AddToCartButton>

    </div>
    </Link>
  );
}
