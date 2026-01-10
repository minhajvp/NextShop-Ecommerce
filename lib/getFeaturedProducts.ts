import Product from "@/models/Product";
import { connectDB } from "./db";


export async function getFeaturedProducts(limit = 6) {
    await connectDB

    const products = await Product.find().sort({ createdAt: -1 }).limit(limit).lean()

    return products.map((p) => (
        {
            _id: p._id.toString(),
            title: p.title,
            price: p.price,
            image: p.image,
        }
    ))
}