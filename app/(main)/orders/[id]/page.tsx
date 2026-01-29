
import CancelOrderButton from "@/components/CancelOrderButton";
import { getOrderById } from "@/lib/getOneOrderById";
import { redirect } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    redirect("/orders");
  }

 



  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Order Details</h1>

      <div className="border rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">Order ID:</p>
            <p className="text-sm text-gray-600">{order._id}</p>
            <p className="text-sm text-gray-500 mt-1">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <span className="px-3 py-1 rounded bg-gray-100 text-sm">
            {order.status.toUpperCase()}
          </span>
        </div>

        <div>
          <h2 className="font-semibold mb-1">Delivery Address</h2>
          <p className="text-gray-700">
            {order.address.fullName} ({order.address.phone})
          </p>
          <p className="text-gray-600">
            {order.address.addressLine1} {order.address.addressLine2}
          </p>
          <p className="text-gray-600">
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Items</h2>

          <div className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between border p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "/placeholder.png"}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      ₹ {item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">₹ {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>₹ {order.totalPrice}</p>
        </div>
        {order.status === 'pending' ?(
            <CancelOrderButton orderId={order._id}/>
        ):(
            <></>
        )}
        

        
        
      </div>
    </div>
  );
}
