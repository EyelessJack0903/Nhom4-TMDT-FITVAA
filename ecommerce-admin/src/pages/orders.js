// pages/orders.js
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import SearchOrders from "../../components/SearchOrders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0); 

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setFilteredOrders(response.data); 
      setTotalOrders(response.data.length); 
    });
  }, []);

  // Lọc đơn hàng dựa trên tìm kiếm
  const handleSearch = (searchQuery) => {
    const result = orders.filter(
      (order) =>
        order._id.includes(searchQuery) ||
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(result);
    setCurrentPage(1); 
    setTotalOrders(result.length); 
  };

  // Tính toán các đơn hàng cần hiển thị
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Tổng số trang
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Layout>
      <SearchOrders onSearch={handleSearch} />

      <table className="basic">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày đặt</th>
            <th>Hóa đơn</th>
            <th>Sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <strong>{order.name}</strong> - {order.email}
                  <br />
                  {order.streetAddress}
                  <br />
                  {order.city} - {order.country}
                  <br />
                  {order.postalCode}
                </td>
                <td>
                  {order.line_items.map((l, index) => (
                    <div key={index}>
                      {l.price_data?.product_data.name} x {l.quantity}
                      <br />
                    </div>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có đơn hàng nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Trang sau
        </button>
      </div>

      <style jsx>{`
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
        .pagination button {
          padding: 8px 16px;
          font-size: 14px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #0070f3;
          color: white;
        }
        .pagination button:disabled {
          background-color: #f1f1f1;
          color: #aaa;
          cursor: not-allowed;
          border-color: #e0e0e0;
        }
        .pagination span {
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </Layout>
  );
}
