import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description:{ type:String ,required:true},
    category:{ type:String,required:true,index:true},
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: {
      type: [String],
      default: [],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "products" } // 👈 collection name
);

// 👇 MODEL NAME = "Product"
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

export default Product;
