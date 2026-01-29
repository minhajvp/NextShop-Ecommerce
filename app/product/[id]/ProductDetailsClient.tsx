"use client";

import { useState } from "react";
import VariantSelector from "./VariantSelector";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "@/components/ByNowButton";


export default function ProductDetailsClient({ product }: { product: any }) {
  const variants = product.variants || [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVariant = variants[selectedIndex];

  // fallback if no variants exist
  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const variantLabel = selectedVariant?.label ?? "default";
  
  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* LEFT */}
      <div className="space-y-4">
        <img
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full h-96 object-cover rounded-xl border"
        />

        <div className="flex gap-3 overflow-x-auto">
          {(product.image || []).map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              className="w-20 h-20 object-cover rounded-lg border"
              alt="thumb"
            />
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100">
          {product.category}
        </span>

        <p className="text-lg font-semibold text-green-700">₹ {price}</p>

        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        {/* ✅ VARIANT SELECTOR */}
        {variants.length > 0 && (
          <VariantSelector
            variants={variants}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}

        {/* Stock */}
        {stock > 0 ? (
          <p className="text-sm text-green-600 font-medium">
            ✅ In Stock ({stock} available)
          </p>
        ) : (
          <p className="text-sm text-red-600 font-medium">❌ Out of Stock</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <AddToCartButton
            product={product}
            variantLabel={variantLabel}
            disabled={stock <= 0}
          />

          <BuyNowButton
            productId={product._id}
            variantLabel={variantLabel}
            disabled={stock <= 0}
          />
        </div>

        {/* Dynamic Sections */}
        <div className="pt-6 space-y-5">
          <Section title="Key Ingredients" items={product.keyIngredients} />
          <Section title="Key Benefits" items={product.keyBenefits} />
          <Section title="Serving Suggestions" items={product.servingSuggestions} />
          <Section title="Highlights" items={product.highlights} />

          <StaticSection title="Shipping & Returns">
            <p className="text-gray-600 text-sm">
              Usually delivered in 2–5 days. Returns accepted only if the pack is
              damaged or expired.
            </p>
          </StaticSection>

          <StaticSection title="Seller Information">
            <p className="text-gray-600 text-sm">
              Sold by NextShop Foods (FSSAI verified). Packed hygienically and
              shipped securely.
            </p>
          </StaticSection>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border rounded-xl p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function StaticSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
