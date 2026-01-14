"use client";

type FilterBarProps = {
  onFilter: (filters: any) => void;
  priceInput: {
    minPrice:string
    maxPrice:string
  }
  setPriceInput: React.Dispatch<React.SetStateAction<{
    minPrice:string
    maxPrice:string
  }>>;
};


export default function FilterBar({
  onFilter,priceInput,setPriceInput
}: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        onChange={(e) => onFilter({ category: e.target.value })}
        className="border px-3 py-2"
      >
        <option value="">All Categories</option>
        <option value="Gadgets">Gadgets</option>
        <option value="electronics">Electronics</option>
      </select>

      <input
  type="number"
  placeholder="Min Price"
  value={priceInput.minPrice}
  className="border px-3 py-2"
  onChange={(e) =>
    setPriceInput((prev) => ({
      ...prev,
      minPrice: e.target.value,
    }))
  }
/>

<input
  type="number"
  placeholder="Max Price"
  value={priceInput.maxPrice}
  className="border px-3 py-2"
  onChange={(e) =>
    setPriceInput((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }))
  }
/>

    </div>
  );
}
