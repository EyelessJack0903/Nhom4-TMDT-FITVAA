import { mongooseConnect } from "../../../../lib/mongoose";
import { Brand } from "../../../../models/Brand"; // Chú ý: Đảm bảo Brand được nhập đúng
import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";

const bucketName = "nhom4-next-ecommerce";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await mongooseConnect(); // Kết nối MongoDB

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const brand = await Brand.findById(id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      return res.status(200).json(brand);
    }

    if (req.method === "PUT") {
      const form = new multiparty.Form();
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const brand = await Brand.findById(id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      const client = new S3Client({
        region: "ap-southeast-2",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      let logoUrl = brand.logo;
      if (files.logo) {
        const file = files.logo[0];
        const ext = mime.extension(file.headers["content-type"]);
        const newFileName = `${Date.now()}.${ext}`;
        await client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: newFileName,
            Body: fs.readFileSync(file.path),
            ContentType: file.headers["content-type"],
            ACL: "public-read",
          })
        );
        logoUrl = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
      }

      const subBrands = fields.subBrands ? JSON.parse(fields.subBrands[0]) : [];

      brand.name = fields.name[0];
      brand.logo = logoUrl;
      brand.subBrands = subBrands; // Cập nhật subBrands
      await brand.save();

      return res.status(200).json(brand);
    }

    if (req.method === "DELETE") {
      const brand = await Brand.findByIdAndDelete(id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/brands/[id]:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
