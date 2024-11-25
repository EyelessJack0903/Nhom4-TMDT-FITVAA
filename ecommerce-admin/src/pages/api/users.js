import { mongooseConnect } from "../../../lib/mongoose";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    const clients = await mongoose.connection
      .collection("clients")
      .find()
      .toArray();
    res.status(200).json(clients);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Thiếu ID người dùng." });
    }
    try {
      await mongoose.connection.collection("clients").deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      res.status(500).json({ error: "Lỗi khi xóa người dùng." });
    }
  } else {
    res.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
}
