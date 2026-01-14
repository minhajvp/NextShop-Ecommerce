"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

type Props = {
  initialProducts: any[]
  totalPages: number
}


export default function LoadMore({ initialProducts, totalPages }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [priceInput, setPriceInput] = useState({
  minPrice: "",
  maxPrice: "",
});

useEffect(() => {
  const timer = setTimeout(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceInput.minPrice,
      maxPrice: priceInput.maxPrice,
    }));
  }, 1000); // ⏱ debounce time

  return () => clearTimeout(timer);
}, [priceInput]);

  useEffect(() => {
    // 🔹 CASE 1: NO search text AND no filters selected
    const noSearch = query.trim() === "";
    const noFilters =
      !filters.category &&
      !filters.minPrice &&
      !filters.maxPrice;

    if (noSearch && noFilters) {
      // Restore initial server-rendered data
      setIsSearching(false);
      setProducts(initialProducts);
      setPage(1);
      return;
    }

    // 🔹 CASE 2: Search OR filters are active
    setIsSearching(true);

    // Reset UI before fetching fresh data
    setProducts([]);
    setPage(0);

    // Fetch page 1 with latest search + filters
    loadMore(true);
  }, [query, filters]);





  async function loadMore(reset = false) {
    if (!reset && page >= totalPages) return;

    setLoading(true);

    const nextPage = reset ? 1 : page + 1;
    const params = new URLSearchParams({
      page: String(nextPage),
      q: query,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });


    const res = await fetch(
      `/api/products??${params.toString()}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    setProducts((prev) => {
      if (reset) {
        return data.data;
      }

      const existingIds = new Set(prev.map((p) => p._id));
      const newProducts = data.data.filter(
        (p: any) => !existingIds.has(p._id)
      );

      return [...prev, ...newProducts];
    });

    setPage(nextPage);
    setLoading(false);
  }




  return (
    <>
      <SearchBar
        onSearch={(q) => {
          setQuery(q);
        }}
      />
      <FilterBar
        onFilter={(newFilter) => {
          setFilters({
            category: newFilter.category ?? "",
            minPrice: newFilter.minPrice ?? "",
            maxPrice: newFilter.maxPrice ?? "",
          });

          // ✅ fetch fresh data
        }}
        priceInput={priceInput} setPriceInput={setPriceInput}
      />




      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {page < totalPages && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => loadMore(false)}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>

  )
}
