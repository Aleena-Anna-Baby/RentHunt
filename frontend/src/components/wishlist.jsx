import React, { useEffect, useState } from 'react';
import './wishlist.css';
import axiosInstance from '../components/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { CiTrash } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from './navbar';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const nav = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axiosInstance.get('/api/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlistItems(res.data.wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
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


    const removeFromWishlist = async (productId) => {
        try {
            await axiosInstance.delete(`/api/wishlist/${productId}`);
            setWishlistItems(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };


    const handleCardClick = (productId) => {
        nav(`/product/${productId}`);
    };

    return (
        <div className="wishlist-container">
            <Navbar />
            <div className='wishlist-page'>
                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col justify-center items-center min-h-[70vh]">
                        <Player
                            autoplay
                            loop
                            src="/emptywish.json"
                            style={{ height: "450px", width: "450px",marginTop:"25px" }}
                        />
                    </div>
                )
                    : (
                        wishlistItems.map((item) => (
                            <div key={item._id} className="wishlist-card">
                                <CiTrash
                                    className="remove-icon"
                                    onClick={() => removeFromWishlist(item._id)}
                                    title="Remove from Wishlist"
                                />
                                <div className="card-content" >
                                    <div className='card-image'>

                                        {item.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`http://localhost:5000${image}`}
                                                alt={item.name}
                                                className={`product-images ${index !== 0 ? 'product-images-hover' : ''}`}
                                                onClick={() => handleCardClick(item._id)}
                                            />
                                        ))}
                                    </div>
                                    <h3 className="wishlist-name" >{item.name}</h3>
                                    <p className="wishlist-rent">Rent/Day: ₹{item.rentalPricing?.find((p) => p.duration === 'day')?.price ?? 'N/A'}</p>
                                </div>
                                <div className='wishlist-cart-btn'>
                                    <button
                                        className={`cardbtnso ${cartItems.includes(item._id) ? "added" : ""}`}
                                        onClick={() => handleCartToggle(item._id)}
                                    >
                                        <IoCartOutline className='cardicon' />
                                        {cartItems.includes(item._id) ? "Carted" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
            </div>
        </div>
    );
};

export default Wishlist;
