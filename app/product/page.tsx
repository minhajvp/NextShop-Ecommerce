import LoadMore from "@/components/LoadMore";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type Props = {
    searchParams:{
        page?:String
    }
}




async function getProducts(page:Number){
    const res = await fetch(`http://localhost:3000/api/products?page=${page}&limit=10`,{
        cache:"no-store"
    })
    return res.json()
    
    
}
export default async function ProductsPage({searchParams}:Props) {
    const params = await searchParams; 
    const page = Number(params.page) || 1
    const result = await getProducts(page)
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        All Products
      </h1>

      <LoadMore initialProducts={result.data} totalPages={result.totalPages}/>

    </div>
  );
}

