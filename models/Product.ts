import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    category: { type: String, required: true, index: true },

    // ✅ Main price/stock (optional: keep as fallback)
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },

    // ✅ Multiple images
    image: {
      type: [String],
      default: [],
    },

    // ✅ Variants (packs)
    variants: {
      type: [
        {
          label: { type: String, required: true }, // "250g"
          weight: { type: Number, required: true }, // 250
          unit: { type: String, default: "g" }, // g/kg/ml
          price: { type: Number, required: true },
          stock: { type: Number, default: 0 },
          discount: {
            type: {
              type: String,   // "percent" | "flat"
              default: null,
            },
            value: {
              type: Number,   // 10 (percent) or 50 (flat)
              default: 0,
            },
          },
        },
      ],
      default: [],
    },

    // ✅ Dynamic sections
    
    features: { type: [String], default: [] },
    keyIngredients: { type: [String], default: [] },
    keyBenefits: { type: [String], default: [] },
    servingSuggestions: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "products" }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
