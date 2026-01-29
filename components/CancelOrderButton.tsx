"use client"

import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {
  orderId: String;
};

export default function CancelOrderButton({orderId}:Props) {
  const router = useRouter()
   async function cancelOrder() {
  const res = await fetch("/api/checkout", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    alert("Unexpected server response");
    return;
  }

  if (!res.ok) {
    alert(data?.message || "Cancellation failed");
    return;
  }

  alert("Order cancelled successfully");

  // ✅ force reload of orders page
  window.location.href = "/orders";
}

  return (
    <div className="flex items-center justify-center">
            <button className="border p-3 rounded bg-red-600 text-white" onClick={()=>cancelOrder()} >Cancel Order</button>
        </div>
  )
}
