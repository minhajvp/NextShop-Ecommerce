




export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  
  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-4">
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully ✅
      </h1>
      <p className="text-gray-600">Order ID: {orderId}</p>
      <a
        href="/product"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Continue Shopping
      </a>
    </div>
  );
}
