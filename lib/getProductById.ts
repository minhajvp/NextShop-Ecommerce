import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function getProductById(id: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const product = await Product.findById(id).lean();

  if (!product) return null;

  return {
    _id: product._id.toString(),     // ✅ convert ObjectId → string
    title: product.title,
    description:product.description,
    category:product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,

  };
}
