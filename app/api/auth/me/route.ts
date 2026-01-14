import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import User from "@/models/User";


export default async function GET() {
    try {
        connectDB();
        const token = (await cookies()).get("token")?.value

        if (!token) {
            return NextResponse.json(
                { user: null },
                { status: 200 }
            );
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
        const user = await User.findById(decoded.userId).select("_id name email").lean()

        if (!user) {
            return NextResponse.json(
                { user: null },
                { status: 200 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { user: null },
            { status: 200 }
        );
    }

}