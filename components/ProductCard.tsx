import { Product } from '@/app/data/product'
import Link from 'next/link'
import React from 'react'

type Props = {
    product:Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.id}`}>
    <div className="border rounded-xl p-4 bg-white hover:shadow-lg hover:-translate-y-1 transition">

        
      <img
        src={product.image}
        alt={product.title}
        className="rounded-lg mb-3 w-full h-48 object-cover"
      />

      <h3 className="font-semibold">{product.title}</h3>

      <p className="text-gray-600">₹ {product.price}</p>

      <button className="mt-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
        Add to Cart
      </button>
    </div>
    </Link>
  );
}
