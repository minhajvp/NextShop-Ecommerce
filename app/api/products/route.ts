import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;
  const query = searchParams.get("q");
  const category = searchParams.get("category")
  const minPrice = Number(searchParams.get("minPrice"))
  const maxPrice = Number(searchParams.get("maxPrice"))

  let filter: any = {};
  if (query) {
    filter = { $text: { $search: query } };
  }
  if (category){
    filter.category = category
  }
  if (minPrice > 0 || maxPrice > 0) {
  filter.price = {};

  if (minPrice > 0) {
    filter.price.$gte = minPrice;
  }

  if (maxPrice > 0) {
    filter.price.$lte = maxPrice;
  }
}


console.log(filter)

  const totalProducts = await Product.countDocuments(filter);
  console.log(totalProducts)

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
    console.log(products)

  return NextResponse.json({
    success: true,
    page,
    limit,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    data: products.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,   
      createdAt: p.createdAt,
    })),
  });
}
