import { mongooseConnect } from "../../../lib/mongoose";
import { Order } from "../../../models/Order";

export default async function handler(req, res) {
  try {
    // Kết nối với MongoDB
    await mongooseConnect();

    // Bắt đầu các tính toán doanh thu
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Bắt đầu ngày hôm nay
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Bắt đầu tháng này
    const startOfYear = new Date(today.getFullYear(), 0, 1); // Bắt đầu năm nay

    // Tính doanh thu hôm nay
    const revenueToday = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay }, // Lọc các đơn hàng trong ngày hôm nay
        },
      },
      {
        $unwind: "$line_items", // Giải nén các sản phẩm trong mỗi đơn hàng
      },
      {
        $group: {
          _id: null, // Tính tổng doanh thu cho tất cả các đơn hàng
          totalRevenue: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$line_items.price_data.unit_amount", // Giá sản phẩm trong cent
                    "$line_items.quantity", // Số lượng sản phẩm
                  ],
                },
                100, // Chia cho 100 để chuyển từ cent sang đô la
              ],
            },
          },
        },
      },
    ]);

    // Tính doanh thu tháng này
    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }, // Lọc các đơn hàng trong tháng này
        },
      },
      {
        $unwind: "$line_items", // Giải nén các sản phẩm trong mỗi đơn hàng
      },
      {
        $group: {
          _id: null, // Tính tổng doanh thu cho tất cả các đơn hàng
          totalRevenue: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$line_items.price_data.unit_amount", // Giá sản phẩm trong cent
                    "$line_items.quantity", // Số lượng sản phẩm
                  ],
                },
                100, // Chia cho 100 để chuyển từ cent sang đô la
              ],
            },
          },
        },
      },
    ]);

    // Tính doanh thu năm nay
    const revenueThisYear = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear }, // Lọc các đơn hàng trong năm nay
        },
      },
      {
        $unwind: "$line_items", // Giải nén các sản phẩm trong mỗi đơn hàng
      },
      {
        $group: {
          _id: null, // Tính tổng doanh thu cho tất cả các đơn hàng
          totalRevenue: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$line_items.price_data.unit_amount", // Giá sản phẩm trong cent
                    "$line_items.quantity", // Số lượng sản phẩm
                  ],
                },
                100, // Chia cho 100 để chuyển từ cent sang đô la
              ],
            },
          },
        },
      },
    ]);

    // Gửi dữ liệu doanh thu
    res.json({
      revenueToday: revenueToday[0]?.totalRevenue || 0,
      revenueThisMonth: revenueThisMonth[0]?.totalRevenue || 0,
      revenueThisYear: revenueThisYear[0]?.totalRevenue || 0,
    });
  } catch (error) {
    // Lỗi nếu có
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
