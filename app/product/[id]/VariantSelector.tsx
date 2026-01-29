"use client";

type Variant = {
  label: string;
  weight: number;
  unit: string;
  price: number;
  stock: number;
};

export default function VariantSelector({
  variants,
  selectedIndex,
  onSelect,
}: {
  variants: Variant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Select Pack</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variants.map((v, idx) => {
          const active = idx === selectedIndex;
          const out = v.stock <= 0;

          return (
            <button
              key={idx}
              disabled={out}
              onClick={() => onSelect(idx)}
              className={`border rounded-xl p-3 text-left transition
                ${active ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"}
                ${out ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400"}
              `}
            >
              <p className="font-semibold">{v.label}</p>
              <p className="text-sm text-gray-600">₹ {v.price}</p>

              {out ? (
                <p className="text-xs text-red-600 mt-1">Out of stock</p>
              ) : (
                <p className="text-xs text-green-600 mt-1">
                  {v.stock} available
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
