// /src/components/RevenueChart.js
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';  

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart({ selectedYear }) {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doanh thu hàng tháng từ API
  const fetchMonthlyRevenue = async (year) => {
    try {
      const response = await axios.get(`/api/revenue/monthly?year=${year}`);
      setMonthlyRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching monthly revenue data:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchMonthlyRevenue(selectedYear);
    }
  }, [selectedYear]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`), // Tạo các label từ Tháng 1 đến Tháng 12
    datasets: [
      {
        label: `Doanh thu ${selectedYear}`,
        data: monthlyRevenueData, // Dữ liệu doanh thu từng tháng
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-4">Doanh thu theo tháng ({selectedYear})</h3>
      <Line data={chartData} />
    </div>
  );
}
