import mongoose, { model, Schema, models } from "mongoose";

const BrandSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
  subBrands: [
    {
      name: { type: String, required: true },
      _id: { type: mongoose.Types.ObjectId },
    },
  ],
});

export const Brand = models.Brand || model("Brand", BrandSchema);
