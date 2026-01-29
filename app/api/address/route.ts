import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Address from "@/models/Address";
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";


export async function GET() {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const addresses = await Address.find({ userId }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    success: true,
    data: addresses.map((a: any) => ({
      _id: a._id.toString(),
      fullName: a.fullName,
      phone: a.phone,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      isDefault: a.isDefault,
    })),
  });
}

export async function POST(req: Request) {
  await connectDB();

  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    isDefault,
  } = body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return NextResponse.json({ message: "All fields required" }, { status: 400 });
  }

  // if making default, unset other defaults
  if (isDefault) {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  const address = await Address.create({
    userId,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    isDefault: !!isDefault,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Address added",
      address: {
        _id: address._id.toString(),
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault,
      },
    },
    { status: 201 }
  );
}
