
import AddToCartButton from '@/app/product/[id]/AddToCartButton';
import Link from 'next/link'
import React from 'react'

type Props = {
    product:any
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product._id}`}>
    <div className="border rounded-xl p-4 bg-white hover:shadow-lg hover:-translate-y-1 transition">

        
      <img
        src={product.image}
        alt={product.title}
        className="rounded-lg mb-3 w-full h-48 object-cover"
      />

      <h3 className="font-semibold">{product.title}</h3>

      <p className="text-gray-600">₹ {product.price}</p>

      <AddToCartButton product={product}></AddToCartButton>
    </div>
    </Link>
  );
}
