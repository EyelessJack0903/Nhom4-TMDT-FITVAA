import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "../../../lib/mongoose";
import { Brand } from "../../../models/Brand";
import mongoose from "mongoose"; // Đảm bảo import mongoose

const bucketName = "nhom4-next-ecommerce";

export default async function handler(req, res) {
  await mongooseConnect(); // Kết nối MongoDB

  try {
    if (req.method === "GET") {
      const brands = await Brand.find();
      return res.status(200).json(brands);
    }

    if (req.method === "POST") {
      const form = new multiparty.Form();

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const client = new S3Client({
        region: "ap-southeast-2",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      let logoUrl = "";
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

      const subBrands = fields.subBrands ? JSON.parse(fields.subBrands[0]).map(subBrand => {
        return {
          ...subBrand,
          _id: mongoose.Types.ObjectId.isValid(subBrand._id) ? subBrand._id : new mongoose.Types.ObjectId()
        };
      }) : [];
      

      const brand = await Brand.create({
        name: fields.name[0],
        logo: logoUrl,
        subBrands,
      });

      res.status(201).json(brand);
    }

    if (req.method === "PUT") {
      const form = new multiparty.Form();

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const { id } = req.query;
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

      // Xử lý subBrands để đảm bảo _id hợp lệ
      const subBrands = fields.subBrands ? JSON.parse(fields.subBrands[0]).map(subBrand => {
        // Nếu không có _id, tạo ObjectId mới
        return {
          ...subBrand,
          _id: subBrand._id ? subBrand._id : new mongoose.Types.ObjectId()
        };
      }) : [];

      brand.name = fields.name[0];
      brand.logo = logoUrl;
      brand.subBrands = subBrands;
      await brand.save();

      res.status(200).json(brand);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      const brand = await Brand.findByIdAndDelete(id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Error in API /api/brands:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
