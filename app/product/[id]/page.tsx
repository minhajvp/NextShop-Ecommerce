
import { notFound } from 'next/navigation'
import React from 'react'
import AddToCartButton from './AddToCartButton'
import { getProductById } from '@/lib/getProductById'

type Props = {
  params: Promise<{
    id: string
  }>
}

async function ProductPage({ params }: Props) {
  const { id } = await (params)
  console.log(id)
  const product = await getProductById(id)
  console.log(product)
  if (!product) {
    notFound()
  }
  return (
    <div className="space-y-4">
      <img
        src={product.image}
        alt={product.title}
        className="rounded-xl border w-100"
      />

      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600">{product.description}</p>

      <p className="text-gray-600">₹ {product.price}</p>
      

      <p className="text-sm text-gray-500">
        Category: {product.category}
      </p>


      <AddToCartButton product={product} />
      <button className='px-4 py-2 bg-green-600 text-white rounded-lg ml-2'>Buy Now</button>
    </div>
  )
}

export default ProductPage