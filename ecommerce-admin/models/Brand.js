import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
});

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
export default Brand;
