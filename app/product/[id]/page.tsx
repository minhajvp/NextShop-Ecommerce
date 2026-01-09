import { products } from '@/app/data/product'
import React from 'react'

type Props = {
    params : {
        id:string
    }
}

 async function ProductPage({params}:Props) {
  const {id} =  await(params)
  const product = products.find((p)=>
      p.id === Number(id)
  )
  if(!product){
    return <h1>Product not Found</h1>
  }
  return (
    <div className="space-y-4">
      <img
        src={product.image}
        alt={product.title}
        className="rounded-xl border w-60"
      />

      <h1 className="text-2xl font-bold">{product.title}</h1>

      <p className="text-gray-600">₹ {product.price}</p>

      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
        Add to Cart
      </button>
    </div>
  )
}

export default ProductPage