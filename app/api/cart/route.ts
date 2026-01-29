import { connectDB } from "@/lib/db";
import getFinalPrice from "@/lib/getFinalPrice";
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
        return NextResponse.json(
            { message: "Error fetching cart" },
            { status: 500 }
        )
    }
}




export async function POST(req: Request) {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let { productId, quantity, variantLabel } = await req.json();
  console.log("cart api:",variantLabel)
  const qty = Math.max(1, Number(quantity) || 1);

  const product = await Product.findById(productId).lean();
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // ✅ Validate variant
  if (!variantLabel) {
    return NextResponse.json({ message: "Variant required" }, { status: 400 });
  }

  if(variantLabel==='default'){
    variantLabel = product.variants?.[0]
  }

  const variant = product.variants?.find(
    (v: any) => v.label === variantLabel
  );

  if (!variant) {
    return NextResponse.json({ message: "Variant not found" }, { status: 404 });
  }

  if (variant.stock <= 0) {
    return NextResponse.json({ message: "Out of stock" }, { status: 400 });
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existing = cart.items.find(
    (item: any) =>
      item.productId.toString() === productId &&
      item.variantLabel === variantLabel
  );

  const finalPrice = getFinalPrice(variant);

  if (existing) {
    if (existing.quantity + qty > variant.stock) {
      return NextResponse.json(
        { message: `Only ${variant.stock} left for ${variantLabel}` },
        { status: 400 }
      );
    }

    existing.quantity += qty;
  } else {
    cart.items.push({
      productId,
      variantLabel: variant.label,
      title: product.title,

      price: finalPrice,              // ✅ discounted
      originalPrice: variant.price,   // ✅ MRP

      image: product.image?.[0],     // ✅ correct field
      quantity: qty,
    });
  }

 

  await cart.save();

  return NextResponse.json(
    {
      success: true,
      cart: cart.toObject(),
    },
    { status: 200 }
  );
}



export async function PATCH(req: Request) {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity, variantLabel } = await req.json();
  


  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  const item = cart.items.find(
    (item: any) =>
      item.productId.toString() === productId &&
      item.variantLabel === variantLabel
  );
  
  

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 405 });
  }

  const qty = Math.max(1, Number(quantity) || 1);
  item.quantity = qty;

  await cart.save();

  return NextResponse.json({ success: true, cart: cart.toObject() }, { status: 200 });
}



export async function DELETE(req: Request) {
    await connectDB();

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId ,variantLabel } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
        (item: any) => !(
            item.productId.toString() === productId &&
            item.variantLabel === variantLabel
        )
    );

    await cart.save();

    return NextResponse.json({ 
        success: true, 
        cart: cart.toObject()
    }, { status: 200 });
}
