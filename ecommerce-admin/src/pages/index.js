import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaUsers, FaBox, FaShoppingCart } from "react-icons/fa"; 

export default function Home() {
  const { data: session } = useSession();
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0); 
  const [totalOrders, setTotalOrders] = useState(0); 

  // Lấy thông tin ngày, tháng, năm từ máy
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();

  // Hàm lấy doanh thu từ API
  const fetchRevenue = async () => {
    try {
      const response = await axios.get("/api/revenue");
      console.log("Fetched revenue:", response.data); 

      // Cập nhật các giá trị doanh thu từ phản hồi API
      setDailyRevenue(response.data.revenueToday || 0);
      setMonthlyRevenue(response.data.revenueThisMonth || 0);
      setYearlyRevenue(response.data.revenueThisYear || 0);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setDailyRevenue(0);
      setMonthlyRevenue(0);
      setYearlyRevenue(0);  
    }
  };

  // Hàm lấy tổng số clients từ API
  const fetchTotalClients = async () => {
    try {
      const response = await axios.get("/api/clients/total");
      console.log("Tổng số clients:", response.data.totalClients); 
      setTotalClients(response.data.totalClients);  
    } catch (error) {
      console.error("Lỗi khi lấy tổng số clients:", error);
    }
  };

  // Hàm lấy tổng số sản phẩm từ API
  const fetchTotalProducts = async () => {
    try {
      const response = await axios.get("/api/products"); 
      console.log("Total products:", response.data.length);
      setTotalProducts(response.data.length); 
    } catch (error) {
      console.error("Error fetching total products:", error);
    }
  };

  // Hàm lấy tổng số đơn hàng từ API
  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get("/api/orders"); 
      console.log("Total orders:", response.data.length);
      setTotalOrders(response.data.length); 
    } catch (error) {
      console.error("Error fetching total orders:", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchTotalClients();
    fetchTotalProducts(); 
    fetchTotalOrders(); 
  }, []);  

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between items-center">
        <h2>
          Hello, <b>{session?.user.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6" />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4">Doanh thu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Ô Doanh thu hôm nay */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-blue-500">
            <FaMoneyBillWave className="text-4xl text-blue-500 mb-4" />
            <h4 className="text-xl font-semibold">Doanh thu ngày {currentDay}/{currentMonth}</h4>
            <p className="mt-2 text-2xl font-bold">
              {dailyRevenue > 0
                ? `${dailyRevenue.toLocaleString()} $`
                : '$0'}
            </p>
          </div>

          {/* Ô Doanh thu tháng này */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-green-500">
            <FaMoneyBillWave className="text-4xl text-green-500 mb-4" />
            <h4 className="text-xl font-semibold">Doanh thu tháng {currentMonth}</h4>
            <p className="mt-2 text-2xl font-bold">
              {monthlyRevenue > 0
                ? `${monthlyRevenue.toLocaleString()} $`
                : '$0'}
            </p>
          </div>

          {/* Ô Doanh thu năm nay */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-yellow-500">
            <FaMoneyBillWave className="text-4xl text-yellow-500 mb-4" />
            <h4 className="text-xl font-semibold">Doanh thu năm {currentYear}</h4>
            <p className="mt-2 text-2xl font-bold">
              {yearlyRevenue > 0
                ? `${yearlyRevenue.toLocaleString()} $`
                : '$0'}
            </p>
          </div>
        </div>
      </div>

      {/* Hiển thị tổng quan */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4">Tổng quan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Ô Tổng số Clients */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-orange-500">
            <FaUsers className="text-4xl text-orange-500 mb-4" />
            <h4 className="text-xl font-semibold">Tổng số tài khoản</h4>
            <p className="mt-2 text-2xl font-bold">
              {totalClients > 0
                ? `${totalClients.toLocaleString()} tài khoản`
                : '0 tài khoản'}
            </p>
          </div>

          {/* Ô Tổng số Sản phẩm */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-purple-500">
            <FaBox className="text-4xl text-purple-500 mb-4" />
            <h4 className="text-xl font-semibold">Tổng số sản phẩm</h4>
            <p className="mt-2 text-2xl font-bold">
              {totalProducts > 0
                ? `${totalProducts.toLocaleString()} sản phẩm`
                : '0 sản phẩm'}
            </p>
          </div>
          
          {/* Ô Tổng số Đơn hàng */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-l-4 border-cyan-700">
            <FaShoppingCart className="text-4xl text-cyan-700 mb-4" />
            <h4 className="text-xl font-semibold">Tổng số đơn hàng</h4>
            <p className="mt-2 text-2xl font-bold">
              {totalOrders > 0
                ? `${totalOrders.toLocaleString()} đơn hàng`
                : '0 đơn hàng'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
