"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* =========================
   Helper: Calculate discount
========================= */
function getFinalPrice(variant: any) {
  let price = variant.price;

  if (variant.discount?.type === "percent") {
    price = price - (price * variant.discount.value) / 100;
  }

  if (variant.discount?.type === "flat") {
    price = price - variant.discount.value;
  }

  return Math.max(Math.round(price), 0);
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, loading } = useAuth();
  const { cart, totalPrice, fetchDbCart } = useCart();

  /* =========================
     Buy Now params
  ========================= */
  const mode = searchParams.get("mode");
  const productId = searchParams.get("productId");
  const variantLabel = searchParams.get("variant");
  const qty = Number(searchParams.get("qty")) || 1;

  const isBuyNow = mode === "buynow" && productId;

  const [buyNowItem, setBuyNowItem] = useState<any>(null);

  /* =========================
     Address state
  ========================= */
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  /* =========================
     Auth guard
  ========================= */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  /* =========================
     Fetch Buy Now product
  ========================= */
  useEffect(() => {
    if (!isBuyNow) return;

    async function fetchBuyNowProduct() {
      const res = await fetch(`/api/products/${productId}`, {
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return;

      const product = data.data;
      

      const variant = product.variants?.find(
        (v: any) => v.label === variantLabel
        
      );


      if (!variant) {
        alert("Selected variant not found");
        return;
      }

      const finalPrice = getFinalPrice(variant);

      setBuyNowItem({
        productId: product._id,
        title: product.title,

        price: finalPrice,             // ✅ discounted
        originalPrice: variant.price,  // ✅ MRP

        image: product.image?.[0],
        quantity: qty,
        variantLabel: variant.label,
      });
    }

    fetchBuyNowProduct();
  }, [isBuyNow, productId, variantLabel, qty]);

  /* =========================
     Fetch addresses + cart
  ========================= */
  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchDbCart();
    }
  }, [user]);

  async function fetchAddresses() {
    const res = await fetch("/api/address", { cache: "no-store" });
    if (!res.ok) return;

    const data = await res.json();
    setAddresses(data.data);

    const defaultAddress = data.data.find((a: any) => a.isDefault);
    if (defaultAddress) setSelectedAddress(defaultAddress._id.toString());
  }

  /* =========================
     Items & total
  ========================= */
  const checkoutItems = isBuyNow
    ? [buyNowItem].filter(Boolean)
    : cart;

    

  const checkoutTotal = isBuyNow
    ? (buyNowItem?.price || 0) * (buyNowItem?.quantity || 0)
    : totalPrice;



  /* =========================
     Place Order
  ========================= */
  async function placeOrder() {
    if (!selectedAddress) {
      alert("Select address");
      return;
    }

    setPlacing(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressId: selectedAddress,
        mode: isBuyNow ? "buynow" : "cart",
        productId: isBuyNow ? productId : null,
        quantity: isBuyNow ? qty : null,
        variantLabel,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to place order");
      setPlacing(false);
      return;
    }

    setPlacing(false);
    window.location.href = `/checkout/success?orderId=${data.orderId}`;
;
  }

  /* =========================
     Empty cart guard
  ========================= */
  if (!isBuyNow && cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto mt-10">Loading...</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Address */}
      <div className="border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Select Address</h2>

        {addresses.map((a) => (
          <label
            key={a._id}
            className="flex gap-3 border p-3 rounded cursor-pointer"
          >
            <input
              type="radio"
              checked={selectedAddress === a._id}
              onChange={() => setSelectedAddress(a._id)}
            />
            <div>
              <p className="font-semibold">
                {a.fullName} ({a.phone})
              </p>
              <p className="text-gray-600">
                {a.addressLine1} {a.addressLine2}
              </p>
              <p className="text-gray-600">
                {a.city}, {a.state} - {a.pincode}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        {checkoutItems.map((item: any) => {
          const hasDiscount =
            item.originalPrice && item.originalPrice > item.price;
            console.log("Disc",hasDiscount)

          const savings = hasDiscount
            ? (item.originalPrice - item.price) * item.quantity
            : 0;

          return (
            <div
              key={`${item.productId}-${item.variantLabel}`}
              className="flex justify-between items-start border-b pb-3"
            >
              <div className="flex gap-3">
                <img
                  src={item.image || "/placeholder.png"}
                  className="w-14 h-14 rounded object-cover border"
                />

                <div>
                  <p className="font-medium">
                    {item.title}
                    <span className="text-sm text-gray-500">
                      {" "}
                      ({item.variantLabel})
                    </span>
                  </p>

                  <div className="text-sm">
                    {hasDiscount && (
                      <span className="line-through text-gray-400 mr-2">
                        ₹ {item.originalPrice}
                      </span>
                    )}
                    <span>
                      ₹ {item.price} × {item.quantity}
                    </span>
                  </div>

                  {hasDiscount && (
                    <p className="text-xs text-green-600">
                      You save ₹ {savings}
                    </p>
                  )}
                </div>
              </div>

              <p className="font-semibold">
                ₹ {item.price * item.quantity}
              </p>
            </div>
          );
        })}

        <div className="border-t pt-4 flex justify-between font-bold">
          <p>Total</p>
          <p>₹ {checkoutTotal}</p>
        </div>

        <button
          disabled={placing}
          onClick={placeOrder}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
