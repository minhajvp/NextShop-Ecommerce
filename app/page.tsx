import ProductCard from "@/components/ProductCard";


async function getProducts(){
    const res = await fetch("http://localhost:3000/api/products/",{
        cache:"no-store"
    })
    const result = await res.json()
    return result.data
}

export default async function Home() {

  const products = await getProducts()
  const featured = products.slice(0, 3);
  return (
    <div className="space-y-10">

      {/* HERO SECTION */}
      <section className="bg-white rounded-2xl border p-8">
        <h1 className="text-3xl font-bold ">
          Welcome to <span className="text-blue-700">NextShop</span>
        </h1>

        <p className="text-gray-600 mt-2">
          Your modern ecommerce store built with Next.js & TypeScript.
        </p>

        <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white">
          Shop Now
        </button>
      </section>
       <section>
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((product:any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
