import { Product } from "../../../models/Product";
import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    if (req.query?.id) {
      const product = await Product.findOne({ _id: req.query.id }).populate("brand");
      res.json({
        ...product._doc,
        brand: product.brand?._id || "", 
      });
    } else {
      const products = await Product.find().populate("brand");
      res.json(products);
    }
  }

  if (method === "POST") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      detailedSpecs,
      brand,
    } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      detailedSpecs,
      brand,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      _id,
      title,
      description,
      price,
      images,
      category,
      properties,
      detailedSpecs,
      brand,
    } = req.body;
    const updated = await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        images,
        category,
        properties,
        detailedSpecs,
        brand,
      }
    );
    if (updated.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      const deleted = await Product.deleteOne({ _id: req.query.id });
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(true);
    }
  }
}
