import { mongooseConnect } from "../../../../lib/mongoose";
import { Order } from "../../../../models/Order";

export default async function handler(req, res) {
  const { year } = req.query; 

  try {
    await mongooseConnect();

    const startOfYear = new Date(year, 0, 1); 
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);  

    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $unwind: "$line_items", 
      },
      {
        $group: {
          _id: { $month: "$createdAt" },  
          totalRevenue: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$line_items.price_data.unit_amount",  
                    "$line_items.quantity", 
                  ],
                },
                100, 
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },  // Sắp xếp theo tháng
      },
    ]);

    // Tạo mảng doanh thu cho từng tháng (nếu không có doanh thu cho tháng nào, mặc định là 0)
    const monthlyRevenue = Array(12).fill(0);
    revenueByMonth.forEach((item) => {
      monthlyRevenue[item._id - 1] = item.totalRevenue;  // _id là tháng
    });

    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu doanh thu.' });
  }
}
