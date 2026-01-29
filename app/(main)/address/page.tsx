"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AddressPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchAddresses() {
    const res = await fetch("/api/address", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setAddresses(data.data);
  }

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed");
      setSaving(false);
      return;
    }

    setForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });

    await fetchAddresses();
    setSaving(false);
  }

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      <h1 className="text-2xl font-bold">Your Addresses</h1>

      {/* LIST */}
      <div className="space-y-4">
        {addresses.map((a) => (
          <div key={a._id} className="border p-4 rounded-lg">
            <p className="font-semibold">
              {a.fullName} ({a.phone})
              {a.isDefault && (
                <span className="ml-2 text-green-600 text-sm">(Default)</span>
              )}
            </p>
            <p className="text-gray-600">
              {a.addressLine1} {a.addressLine2}
            </p>
            <p className="text-gray-600">
              {a.city}, {a.state} - {a.pincode}
            </p>
          </div>
        ))}
      </div>

      {/* FORM */}
      <form onSubmit={addAddress} className="border p-6 rounded-xl space-y-3">
        <h2 className="text-xl font-bold">Add New Address</h2>

        {error && <p className="text-red-600">{error}</p>}

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Address Line 1"
          value={form.addressLine1}
          onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Address Line 2 (optional)"
          value={form.addressLine2}
          onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          Set as default address
        </label>

        <button
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Address"}
        </button>
      </form>
    </div>
  );
}
