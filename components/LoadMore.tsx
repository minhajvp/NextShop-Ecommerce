"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";

type Props = {
    initialProducts: any[]
    totalPages: number
}


export default function LoadMore({ initialProducts, totalPages }: Props) {
    const [products, setProducts] = useState(initialProducts)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [query,setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false);


    async function loadMore(reset = false) {
  if (!reset && page >= totalPages) return;

  setLoading(true);

  const nextPage = reset ? 1 : page + 1;

  const res = await fetch(
    `/api/products?page=${nextPage}&limit=10&q=${query}`,
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

    if (q.trim() === "") {
      // ✅ CLEAR SEARCH
      setIsSearching(false);
      setProducts(initialProducts);
      setPage(1);
      return;
    }

    // ✅ SEARCH MODE
    setIsSearching(true);
    setPage(0);
    loadMore(true);
  }}
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
