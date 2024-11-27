import { Product } from "../../../models/Product";
import { Brand } from "../../../models/Brand"; // Import model Brand
import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect(); // Đảm bảo kết nối MongoDB
  await isAdminRequest(req, res); // Kiểm tra quyền admin

  try {
    if (method === "GET") {
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id }).populate("brand");
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json({
          ...product._doc,
          brand: product.brand?._id || "",
          subBrand: product.subBrand || "",
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
        subBrand,
        stock,
      } = req.body;

      console.log("Request body in PUT:", req.body);

      if (!title || !price || !brand || stock === undefined) {
        return res.status(400).json({ error: "Title, price, brand, and stock are required." });
      }

      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,
        detailedSpecs,
        brand,
        subBrand,
        stock,
      });
      res.status(201).json(productDoc);
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
        subBrand,
        stock,
      } = req.body;
    
      if (!_id) {
        return res.status(400).json({ error: "Product ID is required for update." });
      }
    
      console.log("Request body in PUT:", req.body); 
    
      if (typeof stock !== "number") {
        return res.status(400).json({ error: "Stock must be a number." });
      }
    
      const productBeforeUpdate = await Product.findOne({ _id });
      console.log("Product before update:", productBeforeUpdate);
    
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
          subBrand,
          stock, 
        }
      );
    
      const updatedProduct = await Product.findOne({ _id });
      console.log("Product after update:", updatedProduct);  
    
      if (updated.matchedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
    
      res.json({ success: true, message: "Product updated successfully." });
    }    

    if (method === "DELETE") {
      if (!req.query?.id) {
        return res.status(400).json({ error: "Product ID is required for deletion." });
      }

      const deleted = await Product.deleteOne({ _id: req.query.id });
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true, message: "Product deleted successfully." });
    }
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
