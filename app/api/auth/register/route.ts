import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(req: Request) {

    try {
        connectDB();
        const { name, email, password } = await req.json()
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }
        const userExist = await User.findOne({ email })
        if (userExist) {
            return NextResponse.json(
                { message: "Email is Already registered" },
                { status: 409 }
            )

        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const userId = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return NextResponse.json(
            { status: 201,message: `"User created Successfully, ID is ${userId._id}"` },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `Error occured -- ${error}` },
            { status: 500 }
        )
    }
}