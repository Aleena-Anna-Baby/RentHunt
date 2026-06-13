import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductManagement.css";

const ProductManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        subcategory: "",
        description: "",
        actualPrice: "",
        rentalPricing: { daily: "", weekly: "", monthly: "" },
        securityDeposit: "",
        images: [],
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://renthunt-backend.onrender.com/api/products");
            console.log("Fetched Products:", response.data);  
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (["daily", "weekly", "monthly"].includes(name)) {
            setFormData((prevData) => ({
                ...prevData,
                rentalPricing: { ...prevData.rentalPricing, [name]: value },
            }));
        } else if (name === "images") {
            const files = Array.from(e.target.files);
            setFormData({ ...formData, images: files });

            const previewUrls = files.map((file) => URL.createObjectURL(file));
            setImagePreviews(previewUrls);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...files],
        }));
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...previewUrls]);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedRentalPricing = [
            { duration: "day", price: formData.rentalPricing.daily },
            { duration: "week", price: formData.rentalPricing.weekly },
            { duration: "month", price: formData.rentalPricing.monthly },
        ];

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData.images.forEach((image) => formDataToSend.append("image", image));
            } else if (key === "rentalPricing") {
                formDataToSend.append("rentalPricing", JSON.stringify(formattedRentalPricing));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await axios.post("https://renthunt-backend.onrender.com/api/products/add", formDataToSend);
            fetchProducts();
            resetForm();
            setShowForm(false); 
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleEdit = (id, field, value) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                if (product._id === id) {
                    if (field.startsWith("rentalPricing.")) {
                        const duration = field.split(".")[1];

                        return {
                            ...product,
                            rentalPricing: {
                                ...product.rentalPricing,
                                [duration]: value || product.rentalPricing[duration],  
                            },
                        };
                    } else {
                        return { ...product, [field]: value || product[field] };
                    }
                }
                return product;
            })
        );
    };


    const saveEdit = async (product) => {
        try {
            const formDataToSend = new FormData();

            const formattedRentalPricing = [
                { duration: "day", price: Number(product.rentalPricing.daily || 0) },
                { duration: "week", price: Number(product.rentalPricing.weekly || 0) },
                { duration: "month", price: Number(product.rentalPricing.monthly || 0) },
            ];


            formDataToSend.append("rentalPricing", JSON.stringify(formattedRentalPricing));

            console.log("Sending data to backend:", {
                product,
                formattedRentalPricing,
            });

            Object.keys(product).forEach((key) => {
                if (key !== "rentalPricing" && key !== "images") {
                    formDataToSend.append(key, product[key]);
                }
            });

            if (product.images && product.images.length > 0) {
                product.images.forEach((image) => formDataToSend.append("image", image));
            }

            await axios.put(`https://renthunt-backend.onrender.com/api/products/${product._id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error(" Error updating product:", error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://renthunt-backend.onrender.com/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            subcategory: "",
            description: "",
            actualPrice: "",
            rentalPricing: { daily: "", weekly: "", monthly: "" },
            securityDeposit: "",
            images: [],
        });
        setImagePreviews([]);
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const backendURL = "https://renthunt-backend.onrender.com";

    return (
        <div className="product-management-container">
            <h1>Product Management</h1>
            <input
                type="text"
                className="search-input"
                placeholder="Search Product by Name, Category, or Subcategory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="add-product-btn" onClick={() => setShowForm(!showForm)}>
                Add Product
            </button>

            {showForm && (
                <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required />
                    <input type="number" name="actualPrice" placeholder="Actual Price" value={formData.actualPrice} onChange={handleInputChange} required />
                    <div className="cat-sub">
                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                        <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleInputChange} required />
                    </div>
                    <input type="number" name="securityDeposit" placeholder="Security Deposit" value={formData.securityDeposit} onChange={handleInputChange} required />

                    {/* <h4>Rental Pricing</h4> */}
                    <input type="number" name="daily" placeholder="Daily Rent" value={formData.rentalPricing.daily} onChange={handleInputChange} required />
                    <input type="number" name="weekly" placeholder="Weekly Rent" value={formData.rentalPricing.weekly} onChange={handleInputChange} required />
                    <input type="number" name="monthly" placeholder="Monthly Rent" value={formData.rentalPricing.monthly} onChange={handleInputChange} required />

                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required></textarea>

                    <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                    <button type="submit">Add Product</button>
                </form>
            )}

            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="product-card">


                        <div className="image-container">
                            {product.images?.length > 0 ? (
                                product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`${backendURL}/${image.replace(/^\/+/, '')}`}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="product-image"
                                    />
                                ))
                            ) : (
                                <img src="default-image.jpg" alt="Default" className="product-image" />
                            )}
                        </div>


                        {editingProduct === product._id ? (
                            <>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => handleEdit(product._id, "name", e.target.value)}
                                    placeholder="Product name"
                                />
                                <input
                                    type="number"
                                    value={product.actualPrice}
                                    onChange={(e) => handleEdit(product._id, "actualPrice", e.target.value)}
                                    placeholder="Price"
                                />
                                <input
                                    type="text"
                                    value={product.category}
                                    onChange={(e) => handleEdit(product._id, "category", e.target.value)}
                                    placeholder="category"
                                />
                                <input
                                    type="text"
                                    value={product.subcategory}
                                    onChange={(e) => handleEdit(product._id, "subcategory", e.target.value)}
                                    placeholder="Subcategory"
                                />
                                <input
                                    type="number"
                                    value={product.securityDeposit}
                                    onChange={(e) => handleEdit(product._id, "securityDeposit", e.target.value)}
                                    placeholder="Security Deposit"
                                />


                                <table>
                                    <tr>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.rentalPricing.daily}
                                                onChange={(e) => handleEdit(product._id, "rentalPricing.daily", e.target.value)}
                                                placeholder="Daily"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.rentalPricing.weekly}
                                                onChange={(e) => handleEdit(product._id, "rentalPricing.weekly", e.target.value)}
                                                placeholder="Weekly"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.rentalPricing.monthly}
                                                onChange={(e) => handleEdit(product._id, "rentalPricing.monthly", e.target.value)}
                                                placeholder="Monthly"
                                            />
                                        </td>
                                    </tr>
                                </table>

                                <textarea
                                    value={product.description}
                                    onChange={(e) => handleEdit(product._id, "description", e.target.value)}
                                />
                                <input type="file" multiple onChange={handleImageChange} />

                                <button className="save-btn" onClick={() => saveEdit(product)}>Save</button>
                                <button className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{product.name}</h3>
                                <p><strong>Price:</strong> ₹{product.actualPrice}</p>
                                <div className="cat-sub">
                                    <p><strong>Category:</strong> {product.category}</p>
                                    <p><strong>Subcategory:</strong> {product.subcategory}</p>
                                </div>

                                <p><strong>Security Deposit:</strong> ₹{product.securityDeposit}</p>
                                <table>
                                    <tr>
                                        <th>Daily</th>
                                        <th>Weekly</th>
                                        <th>Monthly</th>
                                    </tr>
                                    <tr>
                                        <td> ₹{product.rentalPricing?.[0]?.price || "Not Set"}</td>
                                        <td> ₹{product.rentalPricing?.[1]?.price || "Not Set"}</td>
                                        <td> ₹{product.rentalPricing?.[2]?.price || "Not Set"}</td>
                                    </tr>
                                </table>
                                <p><strong>Description:</strong> {product.description}</p>

                                <button className="edit-btn" onClick={() => setEditingProduct(product._id)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ProductManagement;
