import { connectDB } from "@/lib/db";
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();

        const userId = await getUserIdFromToken()
        if (!userId) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                    status: 401
                }, {
                status: 401
            }
            )
        }

        const data = await Cart.findOne({ userId }).lean()

        return NextResponse.json(
            {
                success: true,
                cart: data || { userId, items: [] }
            }
        )
    } catch (err) {
        console.log(err)
    }
}

export async function POST(req: Request) {
    await connectDB();

    const userId = await getUserIdFromToken()
    if (!userId) {
        return NextResponse.json(
            {
                message: "Unauthorized",
                status: 401
            }, {
            status: 401
        }
        )
    }

    const { productId, quantity } = await req.json()
    const product = await Product.findById(productId).lean()
    if (!product) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        )
    }

    let cart = await Cart.findOne({ userId })

    if (!cart) {
        cart = await Cart.create(
            { userId, items: [] }
        )
    }

    const existing = cart.items.find(
        (item: any) => item.productId.toString() === productId
    )

    if (existing) {
        existing.quantity += quantity || 1
    } else {
        cart.items.push({
            productId,
            title: product.title,
            price: product.price,
            image: product.image?.[0],
            quantity: quantity || 1,

        })
    }
    await cart.save()

    return NextResponse.json(
        {success:true,
            cart
        },
        {status:200}
    )
}


export async function PATCH(req:Request) {

    await connectDB();
    const userId = await getUserIdFromToken()
    if (!userId) {
        return NextResponse.json(
            {
                message: "Unauthorized",
                status: 401
            }, {
            status: 401
        }
        )
    }

    const { productId, quantity } = await req.json()
    const product = await Product.findById(productId).lean()
    if (!product) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        )
    }

    let cart = await Cart.findOne({ userId })
     if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  const item = await cart.items.find(
    (item:any)=> item.productId === productId
  )
  if(!item){
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  item.quantity += quantity||1
  await cart.save()

  return NextResponse.json({ success: true, cart }, { status: 200 });

    
}

export async function DELETE(req: Request) {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  cart.items = cart.items.filter(
    (item: any) => item.productId.toString() !== productId
  );

  await cart.save();

  return NextResponse.json({ success: true, cart }, { status: 200 });
}
