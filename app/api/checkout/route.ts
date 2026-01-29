import { connectDB } from "@/lib/db";
import getFinalPrice from "@/lib/getFinalPrice";
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";
import Address from "@/models/Address";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";



export async function POST(req: Request) {

    await connectDB();
    const userId = await getUserIdFromToken()
    if (!userId) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }

    const { addressId, mode, productId, quantity , variantLabel } = await req.json()
    
    if (!addressId) {
        return NextResponse.json(
            { message: "Adress is required" },
            { status: 400 }
        )
    }
    let items: any[] = []
    if (!mode || mode === "cart") {
        const cart = await Cart.findOne({ userId }).lean();
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }
        items = cart.items;
    }



    const address = await Address.findOne({ _id: addressId, userId }).lean()
    if (!address) {
        return NextResponse.json(
            { message: "Address not found" },
            { status: 404 }
        )
    }

    if (mode === "buynow") {
  if (!productId || !variantLabel) {
    return NextResponse.json(
      { message: "productId and variantLabel required" },
      { status: 400 }
    );
  }

  const qty = Math.max(1, Number(quantity) || 1);

  const product = await Product.findById(productId).lean();
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const variant = product.variants?.find((v: any) => v.label === variantLabel);

  if (!variant) {
    return NextResponse.json({ message: "Variant not found" }, { status: 404 });
  }

  if (variant.stock < qty) {
    return NextResponse.json(
      { message: `Only ${variant.stock} left for ${variantLabel}` },
      { status: 400 }
    );
  }
  const finalPrice = getFinalPrice(variant)

  items = [
    {
      productId: product._id,
      variantLabel: variant.label,
      title: product.title,
      originalPrice:variant.price,
      price: finalPrice, // ✅ variant price
      image: product.image?.[0], // ✅ images
      quantity: qty,
    },
  ];
}


    const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
        userId,
        address: {
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
        },
        items,
        totalPrice,
        status: "pending"
    })

      if (!mode || mode === "cart") {
    await Cart.updateOne({ userId }, { $set: { items: [] } });
  }

    return NextResponse.json(
        {
            success: true,
            message: "Order placed successfully",
            orderId: order._id.toString(),
        },
        { status: 201 }
    )
}


export async function PATCH(req: Request) {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    const order = await Order.findOne({ _id: orderId, userId }); // ✅ no lean
    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
        return NextResponse.json(
            { message: `Cannot cancel. Order is already ${order.status}` },
            { status: 400 }
        );
    }

    order.status = "cancelled"; // ✅ assignment
    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
}
