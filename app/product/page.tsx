import ProductCard from "@/components/ProductCard";




async function getProducts(){
    const res = await fetch("http://localhost:3000/api/products/",{
        cache:"no-store"
    })
    const result = await res.json()
    return result.data
    
}
export default async function ProductsPage() {
    const products = await getProducts()
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product:any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
}

