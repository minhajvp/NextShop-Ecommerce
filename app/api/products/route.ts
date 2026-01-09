
// import Product from "@/models/Product";
// import { connectDB } from "@/lib/db";
// import { NextResponse } from "next/server";




// export async function GET() {
//     await connectDB()
//     const products = await Product.find().limit(20)
//     return NextResponse.json({
//         success:true,
//         data:products,
//     })
    
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  console.log("➡️ API /products called");

  await connectDB();
  console.log("✅ MongoDB connected");

  const products = await Product.find();
  console.log("📦 Products found:", products.length);

  return NextResponse.json({
    success: true,
    data: products,
  });
}
