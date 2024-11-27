import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
    detailedSpecs: { type: Object },
    brand: { type: mongoose.Types.ObjectId, ref: "Brand" },
    subBrand: {
      _id: { type: mongoose.Types.ObjectId }, 
      name: { type: String }, 
    },
    stock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);




