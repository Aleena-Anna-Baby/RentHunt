import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./viewProduct.css";
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import axiosInstance from "../components/axiosInstance";
import Navbar from "./navbar";
import { useNavigate } from 'react-router-dom';

const ViewProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [durationType, setDurationType] = useState('day');
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [wishlistedProducts, setWishlistedProducts] = useState([]);
    const [sparkleProductId, setSparkleProductId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);




    const handleWishlistClick = async (productId) => {
        console.log("Clicked Product ID:", productId); 
        console.log("Wishlisted Products before toggle:", wishlistedProducts); 

        try {
            const token = localStorage.getItem("token"); 
            console.log("Token being sent:", token);

            const response = await axiosInstance.post(
                `/api/wishlist/toggle`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", 
                    },
                }
            );


            if (response.data && response.data.wishlist) {
                console.log("Response from backend:", response.data);

                setSparkleProductId(productId);

                setWishlistedProducts((prev) => {
                    const updatedWishlist = prev.includes(productId)
                        ? prev.filter((id) => id !== productId)
                        : [...prev, productId];

                    console.log("Wishlisted Products after toggle:", updatedWishlist); 
                    return updatedWishlist;
                });

                setTimeout(() => setSparkleProductId(null), 1000);
            } else {
                console.error(" Wishlist toggle failed at backend");
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };





    const handleCartToggle = async (productId) => {
        try {

            const userId = localStorage.getItem("userId");
            console.log("Sending userId to backend for cart:", userId);

            if (!userId) {
                console.warn("User not logged in.");
                return;
            }

            if (cartItems.includes(productId)) {
                await axiosInstance.post("/api/cart/remove", {
                    userId,
                    productId,
                    quantity: 1,
                    rentType: "daily"
                });
                setCartItems(prev => prev.filter(id => id !== productId));
            } else {
                await axiosInstance.post("/api/cart/add", {
                    userId,
                    productId,
                    quantity: 1,
                    rentType: "daily"
                });
                setCartItems(prev => [...prev, productId]);
            }
        } catch (error) {
            console.error("Cart update error:", error);
        }
        if (window.fetchCartCount) {
            window.fetchCartCount();
          }
          
    };







    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://renthunt-backend.onrender.com/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            const priceObj = product.rentalPricing.find(p => p.duration === durationType);
            const price = priceObj ? priceObj.price : 0;
            setTotalPrice(price * quantity);
        }
    }, [product, durationType, quantity]);
    

    const handleDurationChange = (e) => setDurationType(e.target.value);
    const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
    const handleImageClick = (index) => setMainImageIndex(index);

    if (!product) return <div className="loading">Loading product details...</div>;

    return (
        <div className="view-product-container">
            <Navbar/>
            <div className="left-section">
                <div className="main-image-container">
                    <img
                        src={`https://renthunt-backend.onrender.com${product.images[mainImageIndex]}`}
                        alt="product"
                        className="main-image"
                        onClick={openModal}
                    />

                    <div className="wishlist-icon"
                        onClick={() => handleWishlistClick(product._id)}
                    >
                        {wishlistedProducts.includes(product._id) ? (
                            <IoMdHeart className="wish-icon filled" />
                        ) : (
                            <CiHeart className="wish-icon" />
                        )}

                        {sparkleProductId === product._id && (
                            <div className="sparkles-animation">
                                {[...Array(6)].map((_, i) => (
                                    <span key={i} className={`dot dot-${i}`}></span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="thumbnail-row">
                    {product.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={`https://renthunt-backend.onrender.com${img}`}
                            alt="thumb"
                            className={`thumbnail ${mainImageIndex === idx ? 'active' : ''}`}
                            onClick={() => handleImageClick(idx)}
                        />
                    ))}
                </div>
            </div>

            <div className="right-section">
                <h1 className="product-title">{product.name}</h1>
                <p className="deposit">Security Deposit: ₹ {product.securityDeposit}</p>

                <div className="rent-section">
                    <div className='rentaldetails'>
                        <input
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={handleQuantityChange}
                        />


                        <select value={durationType} onChange={handleDurationChange}>
                            <option value="day">Per Day</option>
                            <option value="week">Per Week</option>
                            <option value="month">Per Month</option>
                        </select>

                    </div>
                    <p className="total-rent">
                        Rental Price: ₹ {totalPrice}
                    </p>

                </div>

                <div className="buy-section">
                    <h3>Price: ₹ {product.actualPrice ?? 'N/A'}</h3>
                    <div className="button-group">
                            <div className='view-cardbtn'>
                            <button
                                className={`viewcart ${cartItems.includes(product._id) ? "added" : ""}`}
                                onClick={() => handleCartToggle(product._id)}
                            >
                                <IoCartOutline className='cardicon' />
                                {cartItems.includes(product._id) ? "Carted" : "Add to Cart"}
                            </button>
                            </div>
                    </div>
                </div>

                <h3>Details</h3>
                <p className="description-section">{product.description}</p>
            </div>
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✖</button>
                        <img
                            src={`https://renthunt-backend.onrender.com${product.images[mainImageIndex]}`}
                            alt="Enlarged"
                            className="modal-image"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewProduct;
