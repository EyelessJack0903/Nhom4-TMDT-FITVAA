import { useState, useEffect } from "react";
import axios from "axios";

export default function BrandsPage() {
    const [brandName, setBrandName] = useState("");
    const [brandLogo, setBrandLogo] = useState(null);
    const [brandList, setBrandList] = useState([]);
    const [editingBrand, setEditingBrand] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);

    // Fetch existing brands
    useEffect(() => {
        async function fetchBrands() {
            const response = await axios.get("/api/brands");
            setBrandList(response.data);
        }
        fetchBrands();
    }, []);

    const handleSaveBrand = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", brandName);

        // Nếu có logo mới, thêm vào form data
        if (brandLogo) {
            formData.append("logo", brandLogo);
        }

        try {
            if (editingBrand) {
                // Gửi yêu cầu PUT để cập nhật
                const response = await axios.put(`/api/brands/${editingBrand._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setBrandList((prev) =>
                    prev.map((brand) => (brand._id === editingBrand._id ? response.data : brand))
                );
            } else {
                // Gửi yêu cầu POST để thêm mới
                const response = await axios.post("/api/brands", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setBrandList([...brandList, response.data]);
            }

            setBrandName("");
            setBrandLogo(null);
            setPreviewLogo(null); // Reset preview logo
            setEditingBrand(null);
        } catch (error) {
            console.error("Error saving brand:", error.response?.data || error.message);
            alert("Không thể lưu thương hiệu. Vui lòng kiểm tra log để biết thêm chi tiết.");
        }
    };

    // Handle edit
    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setBrandName(brand.name);
        setBrandLogo(null); // Xóa file mới
        setPreviewLogo(brand.logo); // Thêm biến preview logo để hiển thị ảnh cũ
    };

    // Handle delete
    const handleDelete = async (brandId) => {
        if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
            await axios.delete(`/api/brands/${brandId}`);
            setBrandList((prev) => prev.filter((brand) => brand._id !== brandId));
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    {editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                </h2>
                <form onSubmit={handleSaveBrand} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Tên thương hiệu</label>
                        <input
                            type="text"
                            placeholder="Nhập tên thương hiệu (ví dụ: Asus, Lenovo, ...)"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Logo thương hiệu</label>
                        {previewLogo && (
                            <div className="mb-2">
                                <img
                                    src={previewLogo}
                                    alt="Current Logo"
                                    className="h-16 w-16 object-contain border rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setBrandLogo(e.target.files[0]);
                                setPreviewLogo(null); // Xóa preview logo khi tải file mới
                            }}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-purple-800 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        {editingBrand ? "Cập nhật" : "Thêm"}
                    </button>
                    {editingBrand && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingBrand(null);
                                setBrandName("");
                                setBrandLogo(null);
                            }}
                            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    )}
                </form>
            </div>

            {/* Display Brand List */}
            <h2 className="text-xl font-semibold mt-8 mb-4">Các thương hiệu</h2>
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="text-left p-4">Logo thương hiệu</th>
                        <th className="text-left p-4">Tên thương hiệu</th>
                    </tr>
                </thead>
                <tbody>
                    {brandList.map((brand) => (
                        <tr key={brand._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                                <div className="h-16 w-16 flex items-center justify-center bg-gray-50 border rounded-md overflow-hidden">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </td>
                            <td className="p-4">{brand.name}</td>
                            <td className="p-4 flex space-x-4">
                                <button
                                    onClick={() => handleEdit(brand)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(brand._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
