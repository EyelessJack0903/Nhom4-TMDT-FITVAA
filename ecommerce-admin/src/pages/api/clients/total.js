import { mongooseConnect } from "../../../../lib/mongoose";
import Client from "../../../../models/Client";

export default async function handler(req, res) {
  await mongooseConnect(); // Kết nối MongoDB

  if (req.method === "GET") {
    try {
      // Lấy tất cả clients
      const clients = await Client.find(); // Lấy tất cả clients
      console.log("Dữ liệu clients:", clients);  // Kiểm tra tất cả dữ liệu clients

      // Lấy tổng số clients
      const totalClients = await Client.countDocuments();  // Đếm tổng số clients trong CSDL
      console.log("Tổng số clients:", totalClients);  // Kiểm tra số lượng clients

      res.status(200).json({ totalClients });  // Trả về tổng số clients
    } catch (error) {
      console.error("Lỗi khi lấy clients:", error);
      res.status(500).json({ error: "Lỗi khi lấy tổng số clients." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
