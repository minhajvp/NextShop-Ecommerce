export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">

      {/* LEFT SIDEBAR (filters later) */}
      <aside className="hidden md:block border rounded-2xl p-4 bg-white">
        <h3 className="font-semibold">Filters</h3>
        <p className="text-gray-500 text-sm">
          (We will implement this later)
        </p>
      </aside>

      {/* MAIN CONTENT */}
      <div>{children}</div>
    </div>
  );
}
