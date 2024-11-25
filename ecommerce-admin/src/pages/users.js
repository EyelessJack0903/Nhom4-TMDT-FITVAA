import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  // Fetch users from API
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

  return (
    <Layout>
      <div className="p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-6">Danh sách người dùng</h1>
        <table className="table-auto w-full border-collapse bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-4 border">ID</th>
              <th className="text-left p-4 border">Tên</th>
              <th className="text-left p-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
      </div>
    </Layout>
  );
}
