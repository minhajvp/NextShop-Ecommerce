import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findById(id).lean();

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      variants:product.variants || [],
      image: product.image || [],
      createdAt: product.createdAt,
    },
  });
}
