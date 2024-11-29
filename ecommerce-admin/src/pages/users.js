import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const usersPerPage = 5; // Số người dùng mỗi trang

  // Fetch users từ API
  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await axios.delete(`/api/users?id=${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Xóa người dùng thất bại. Vui lòng thử lại!");
      }
    }
  };

  // Tính toán danh sách người dùng hiển thị
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Tổng số trang
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Chuyển sang trang tiếp theo
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Quay lại trang trước đó
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-white rounded-md shadow-md">
        <h1 className="text-1xl mb-6">Danh sách người dùng</h1>
        <table className="table-auto w-full border-collapse bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-4 border">ID</th>
              <th className="text-left p-4 border">Tên</th>
              <th className="text-left p-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 border">{user._id}</td>
                <td className="p-4 border">{user.name}</td>
                <td className="p-4 border">{user.email}</td>
                <td className="p-4 border">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination mt-6 flex justify-between items-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Trang trước
          </button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Trang sau
          </button>
        </div>
      </div>
    </Layout>
  );
}
