export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-blue-950">Next<span className="text-2xl text-blue-700">Shop</span></h1>

        <div className="flex gap-6">
          <a href="/" className="text-black">Home</a>
          <a href="/products" className="text-black">Products</a>
          <a href="/cart" className="text-black" >Cart</a>
          <a href="/about" className="text-black">About</a>
        </div>
      </div>
    </nav>
  );
}
