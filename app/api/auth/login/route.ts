import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export type UserInfo = {
    _id:string,
    name:string,
    email:string,
    password:string
}
export async function POST(req: Request) {

    try {
        connectDB();
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            )
        }
        const user:UserInfo | null = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { message: "Invalid Credentials" },
                { status: 404 }
            )
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid Credentials" },
                { status: 404 }
            )
        }

        // Token Creation JWT
        const token = jwt.sign({
            id: user._id.toString(),
            email: user.email

        },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d"
            }
        )
        const response = NextResponse.json(
            {
                message: "Login Successfull",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email
                },
                status:200

            },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",

        })
        return response
    } catch (error) {
        return NextResponse.json({
            message: "Error occured"
        },
            { status: 500 }
        )
    }

}