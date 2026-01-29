import mongoose from "mongoose";
import User from "./User";
import { unique } from "next/dist/build/utils";
import Product from "./Product";

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
            unique: true

        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                variantLabel: { type: String, required: true }, // ✅ "250g"

                title: String,
                price: Number,
                image: String,
                originalPrice: Number,

                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: true }
)

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;