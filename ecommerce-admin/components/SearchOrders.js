// components/SearchOrders.js
import { useState } from "react";

export default function SearchOrders({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value); // Gửi giá trị tìm kiếm cho parent
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <h1 style={{ margin: 0 }}>Danh sách đơn hàng</h1>
      <input
        type="text"
        placeholder="Tìm kiếm theo ID hoặc hóa đơn..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "300px",
          padding: "8px",
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
