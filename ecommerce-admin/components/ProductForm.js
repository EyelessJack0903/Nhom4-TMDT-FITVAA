import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
    detailedSpecs: existingDetailedSpecs,
    brand: assignedBrand,
    subBrand: assignedSubBrand, // Nhận subBrand
    stock: existingStock,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [category, setCategory] = useState(assignedCategory || "");
    const [productProperties, setProductProperties] = useState(
        assignedProperties || {}
    );
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showDetailedSpecs, setShowDetailedSpecs] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(assignedBrand || "");
    const [subBrands, setSubBrands] = useState([]);
    const [selectedSubBrand, setSelectedSubBrand] = useState(
        assignedSubBrand || ""
    );
    const [detailedSpecs, setDetailedSpecs] = useState(
        existingDetailedSpecs || {
            CPU: "",
            RAM: "",
            "Ổ cứng": "",
            VGA: "",
            Display: "",
            Pin: "",
            Color: "",
            "Hệ điều hành": "",
            "Xuất xứ": "",
        }
    );
    const [stock, setStock] = useState(existingStock !== null && existingStock !== undefined ? existingStock : 0);
    const router = useRouter();

    // Fetch categories when component mounts
    useEffect(() => {
        console.log("Selected SubBrand:", selectedSubBrand);
        async function fetchData() {
            const categoriesRes = await axios.get("/api/categories");
            setCategories(categoriesRes.data);

            const brandsRes = await axios.get("/api/brands");
            setBrands(brandsRes.data);

            // Gán danh sách subBrand nếu đang chỉnh sửa
            if (assignedBrand) {
                const brand = brandsRes.data.find((b) => b._id === assignedBrand);
                if (brand?.subBrands?.length > 0) {
                    setSubBrands(brand.subBrands);
                    setSelectedSubBrand(assignedSubBrand || "");
                }
            }
        }
        fetchData();
    }, [assignedBrand, assignedSubBrand], [selectedSubBrand]);

    const handleSubBrandChange = (subBrandId) => {
        setSelectedSubBrand(subBrandId); // Cập nhật ID của SubBrand
    };


    const handleBrandChange = (brandId) => {
        setSelectedBrand(brandId);
        const selectedBrand = brands.find((brand) => brand._id === brandId);
        if (selectedBrand?.subBrands?.length > 0) {
            setSubBrands(selectedBrand.subBrands);
            setSelectedSubBrand("");
        } else {
            setSubBrands([]);
            setSelectedSubBrand("");
        }
    };

    // Save product data
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties,
            detailedSpecs,
            brand: selectedBrand,
            subBrand: selectedSubBrand, // Gửi toàn bộ object subBrand
            stock: Number(stock),
        };

        console.log("Data to send:", data); // Log kiểm tra
        try {
            if (_id) {
                await axios.put("/api/products", { ...data, _id });
            } else {
                await axios.post("/api/products", data);
            }
            router.push("/products");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }


    if (goToProducts) {
        router.push("/products");
    }

    // Upload images
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);
            setImages((oldImages) => [...oldImages, ...res.data.links]);
            setIsUploading(false);
        }
    }

    // Update image order
    function updateImagesOrder(images) {
        setImages(images);
    }

    // Set property for the product
    function setProductProp(propName, value) {
        setProductProperties((prev) => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    // Update detailed specs
    function updateDetailedSpec(field, value) {
        setDetailedSpecs((prev) => ({ ...prev, [field]: value }));
    }

    // Gather all properties from category hierarchy
    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        if (catInfo && catInfo.properties) {
            propertiesToFill.push(...catInfo.properties);
        }
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(
                ({ _id }) => _id === catInfo?.parent?._id
            );
            if (parentCat && parentCat.properties) {
                propertiesToFill.push(...parentCat.properties);
            }
            catInfo = parentCat;
        }
    }

    // Remove individual image
    function removeImage(link) {
        setImages((oldImages) => oldImages.filter((img) => img !== link));
    }

    return (
        <form onSubmit={saveProduct} className="p-4 bg-white border rounded shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Chi tiết sản phẩm</h2>
                <button
                    type="button"
                    onClick={() => setShowDetailedSpecs(!showDetailedSpecs)}
                    className="btn-secondary bg-green-400 text-white px-4 py-2 rounded"
                >
                    {showDetailedSpecs ? "Ẩn thông số chi tiết" : "Thêm thông số chi tiết"}
                </button>
            </div>

            {/* Product Name */}
            <label className="block mb-2 font-medium">Tên sản phẩm</label>
            <input
                type="text"
                placeholder="Nhập tên sản phẩm"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                className="mb-4 p-2 w-full border rounded"
            />

            {/* Category Selection */}
            <label className="block mb-2 font-medium">Category</label>
            <select
                value={category}
                onChange={(ev) => setCategory(ev.target.value)}
                className="mb-4 p-2 w-full border rounded"
            >
                <option value="">None</option>
                {categories.length > 0 &&
                    categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
            </select>

            {/* Brand Selection */}
            <label className="block mb-2 font-medium">Thương hiệu</label>
            <select
                value={selectedBrand}
                onChange={(ev) => handleBrandChange(ev.target.value)}
                className="mb-4 p-2 w-full border rounded"
            >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                        {brand.name}
                    </option>
                ))}
            </select>

            {/* Sub-Brand Selection */}
            {subBrands.length > 0 && (
                <>
                    <label className="block mb-2 font-medium">Thương hiệu con</label>
                    <select
                        value={selectedSubBrand || ""} // Dùng ID làm giá trị
                        onChange={(e) => handleSubBrandChange(e.target.value)} // Cập nhật ID
                        className="mb-4 p-2 w-full border rounded"
                    >
                        <option value="">Chọn thương hiệu con</option>
                        {subBrands.map((subBrand) => (
                            <option key={subBrand._id} value={subBrand._id}>
                                {subBrand.name}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* Product Properties */}
            {propertiesToFill.length > 0 &&
                propertiesToFill.map((p) => (
                    <div key={p.name} className="mb-4">
                        <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                        <select
                            value={productProperties[p.name] || ""}
                            onChange={(ev) =>
                                setProductProp(p.name, ev.target.value)
                            }
                            className="w-full p-2 border rounded"
                        >
                            {p.values.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

            {/* Product Images */}
            <label className="block mb-2 font-medium">Ảnh sản phẩm</label>
            <div className="mb-4 flex flex-wrap gap-2">
                <ReactSortable
                    list={images}
                    setList={updateImagesOrder}
                    className="flex flex-wrap gap-2"
                >
                    {!!images?.length &&
                        images.map((link) => (
                            <div
                                key={link}
                                className="h-24 w-24 bg-white p-2 shadow-sm rounded border flex flex-col items-center"
                            >
                                <img src={link} alt="" className="rounded-lg mb-2" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(link)}
                                    className="btn-delete"
                                >
                                    Xóa ảnh
                                </button>
                            </div>
                        ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Tải ảnh</div>
                    <input type="file" className="hidden" onChange={uploadImages} />
                </label>
            </div>

            {/* Product Description */}
            <div className="mt-12">
                <label className="block mb-2 font-medium">Mô tả</label>
                <textarea
                    placeholder="Nhập mô tả sản phẩm"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                    className="mb-4 p-2 w-full border rounded"
                ></textarea>
            </div>

            {/* Product Stock */}
            <label className="block mb-2 font-medium">Số lượng sản phẩm</label>
            <input
                type="number"
                placeholder="Nhập số lượng sản phẩm"
                value={stock}
                onChange={(ev) => setStock(ev.target.value)} 
                className="mb-4 p-2 w-full border rounded"
            />

            {/* Product Price */}
            <label className="block mb-2 font-medium">Giá sản phẩm (VND)</label>
            <input
                type="number"
                placeholder="Nhập giá sản phẩm"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                className="mb-4 p-2 w-full border rounded"
            />

            {/* Detailed Specifications */}
            {showDetailedSpecs && (
                <div className="mb-4 border rounded p-4 bg-gray-50">
                    <h2 className="text-md font-medium mb-4">Thông số kỹ thuật</h2>
                    <div className="grid grid-cols-2 gap-4"> {/* Grid layout */}
                        {Object.keys(detailedSpecs).map((field) => (
                            <div key={field} className="flex flex-col">
                                <label className="font-medium mb-1">{field}</label>
                                <input
                                    type="text"
                                    value={detailedSpecs[field]}
                                    onChange={(e) => updateDetailedSpec(field, e.target.value)}
                                    className="p-2 border rounded w-full"
                                    placeholder={`Nhập ${field}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button type="submit" className="btn-primary bg-blue-500 text-white px-4 py-2 rounded">
                Lưu sản phẩm
            </button>
        </form>
    );
}
