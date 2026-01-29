import Order from "@/models/Order";
import { connectDB } from "./db";
import { getUserIdFromToken } from "./getUserIdFromToken";

export async function getOrders() {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) return null;

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((order: any) => ({
    _id: order._id.toString(),

    address: {
      fullName: order.address?.fullName,
      phone: order.address?.phone,
      addressLine1: order.address?.addressLine1,
      addressLine2: order.address?.addressLine2,
      city: order.address?.city,
      state: order.address?.state,
      pincode: order.address?.pincode,
    },

    items: (order.items || []).map((item: any) => ({
      productId: item.productId?.toString(),
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      variantLabel:item.variantLabel
      
    })),

    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
  }));
}
