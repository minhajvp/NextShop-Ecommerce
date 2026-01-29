import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";


export async function POST(req: NextRequest) {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  console.log(decoded)
  const userId = decoded.id;

  const body = await req.json();
  const items = body.items || [];

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  // merge logic
  for (const item of items) {
    const existing = cart.items.find((p: any) => p.productId.toString() === item.productId.toString());

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
  }

  await cart.save();

  return NextResponse.json({ message: "Cart synced successfully", cart });
}
