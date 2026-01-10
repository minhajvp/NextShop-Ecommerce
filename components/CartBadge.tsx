"use client"
import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import React from 'react'

export default function CartBadge() {
    const {totalItems} = useCart()

  return (
    <Link href="/cart" className="relative">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
