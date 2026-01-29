
import { notFound } from 'next/navigation'
import React from 'react'
import AddToCartButton from './AddToCartButton'
import { getProductById } from '@/lib/getProductById'
import BuyNowButton from '@/components/ByNowButton'
import ProductDetailsClient from './ProductDetailsClient'
import getFinalPrice from '@/lib/getFinalPrice'

type Props = {
  params: Promise<{
    id: string
  }>
}

async function ProductPage({ params }: Props) {
  const { id } = await (params)
  
  const product = await getProductById(id)
  
  if (!product) {
    notFound()
  }
  return (
    
<div className="max-w-6xl mx-auto mt-10">
      <ProductDetailsClient product={product} />
    </div>

  )
}

export default ProductPage

{/* <div className="grid md:grid-cols-2 gap-10">
//   {/* LEFT: Gallery */}
//   <div className="space-y-4">
//     <img */}
//       src={product.image?.[0] || "/placeholder.png"}
//       className="w-full h-96 object-cover rounded-xl border"
//       alt={product.title}
//     />

//     <div className="flex gap-3 overflow-x-auto">
//       {(product.image || []).map((img: string, idx: number) => (
//         <img
//           key={idx}
//           src={img}
//           className="w-20 h-20 object-cover rounded-lg border"
//           alt="thumb"
//         />
//       ))}
//     </div>
//   </div>

//   {/* RIGHT: Details */}
//   <div className="space-y-4">
//     <h1 className="text-3xl font-bold">{product.title}</h1>

//     <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100">
//       {product.category}
//     </span>

//     <p className="text-lg font-semibold text-green-700">
//       ₹ {product.price}
//     </p>

//     <p className="text-gray-700 leading-relaxed">{product.description}</p>

//     {/* Stock UI */}
//     {product.stock > 0 ? (
//       <p className="text-sm text-green-600 font-medium">
//         ✅ In Stock ({product.stock} available)
//       </p>
//     ) : (
//       <p className="text-sm text-red-600 font-medium">
//         ❌ Out of Stock
//       </p>
//     )}

//     {/* Add to cart */}
//     <BuyNowButton productId={product._id}/>
//     <AddToCartButton product={product} disabled={product.stock <= 0} />
//   </div>
// </div>

