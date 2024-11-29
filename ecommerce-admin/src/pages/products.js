import Link from "next/link";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State cho ô tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    // Lấy dữ liệu từ API
    useEffect(() => {
        axios.get("/api/products").then((response) => {
            setProducts(response.data);
        });
    }, []);

    // Lọc sản phẩm dựa trên tìm kiếm
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tính toán sản phẩm hiển thị
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Tổng số trang
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

    // Hàm kiểm tra trạng thái sản phẩm
    const getProductStatus = (stock) => {
        if (stock > 3) {
            return <span style={{ color: "green" }}>Còn hàng</span>;
        } else if (stock > 0 && stock <= 3) {
            return <span style={{ color: "orange" }}>Sắp hết hàng</span>;
        } else {
            return <span style={{ color: "red" }}>Hết hàng</span>;
        }
    };

    return (
        <Layout>
            {/* Ô tìm kiếm */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1 style={{ margin: 0 }}>Sản phẩm</h1>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "300px",
                        padding: "8px",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                    }}
                />
            </div>

            {/* Nút thêm sản phẩm */}
            <Link className="btn-primary" href="/products/new">
                Thêm sản phẩm mới
            </Link>

            {/* Bảng sản phẩm */}
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>STT</td> 
                        <td>Tên sản phẩm</td>
                        <td>Số lượng</td>
                        <td>Trạng thái</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product._id}>
                            <td>{index + 1 + (currentPage - 1) * productsPerPage}</td> 
                            <td>{product.title}</td>
                            <td>{product.stock}</td>
                            <td>{getProductStatus(product.stock)}</td>
                            <td>
                                <Link className="btn-default" href={`/products/edit/${product._id}`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>
                                    Edit
                                </Link>

                                <Link className="btn-red" href={`/products/delete/${product._id}`}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0=" />
                                    </svg>
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
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
