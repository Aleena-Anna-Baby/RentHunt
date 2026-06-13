import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './cartPage.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "./navbar";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const nav = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.post('/api/cart/get', { userId });

            const updatedItems = response.data.cart.map(item => ({
                ...item,
                duration: item.duration || 1,
                rentalType: item.rentType || 'day',
                quantity: item.quantity || 1,
            }));

            setCartItems(updatedItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const calculateRentPrice = (item) => {
        const rentOption = item.product.rentalPricing?.find(
            (option) => option.duration === item.rentalType
        );
        const pricePerUnit = rentOption?.price || 0;
        return pricePerUnit * item.duration * item.quantity;
    };

    const handleRentTypeChange = (index, newType) => {
        const updatedItems = [...cartItems];
        updatedItems[index].rentalType = newType;
        setCartItems(updatedItems);
    };

    const handleDurationChange = (index, newDuration) => {
        const updatedItems = [...cartItems];
        updatedItems[index].duration = parseInt(newDuration);
        setCartItems(updatedItems);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        updatedItems[index].quantity = parseInt(newQuantity);
        setCartItems(updatedItems);
    };

    const removeFromCart = async (productId, rentType) => {
        try {
            await axiosInstance.post("/api/cart/remove", { userId, productId, rentType });
            setCartItems(prev =>
                prev.filter(item =>
                    item.product._id !== productId || item.rentalType !== rentType
                )
            );
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
        if (window.fetchCartCount) {
            window.fetchCartCount();
        }

    };

    const handleBuyNow = (item) => {
        const totalPrice = item.product.actualPrice;
        nav('/payment', {
            state: {
                item,
                price: totalPrice,
                buy: true,
                rentType: null,
                duration: null,
                quantity: item.quantity,
            },
        });
    };

    const handleRentNow = (item) => {
        const totalRent = calculateRentPrice(item) + item.product.securityDeposit;
        nav('/payment', {
            state: {
                item,
                price: totalRent,
                buy: false,
                rentType: item.rentalType,
                duration: item.duration,
                quantity: item.quantity,
            },
        });
    };

    return (
        <div>
            <Navbar/>
        <div className="cart-page">
            
            <h1>Your Cart</h1>
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col justify-center items-center min-h-[70vh]">
                        <Player
                            autoplay
                            loop
                            src="/emptycart.json"
                            style={{ height: "350px", width: "350px", marginTop: "50px" }}
                        />
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={item.product._id} className="cart-item">
                            <button
                                className="remove-icon"
                                onClick={() => removeFromCart(item.product._id, item.rentalType)}
                            >
                                <FaTrashAlt />
                            </button>

                            <div className="cart-images">
                                <img
                                    src={`https://renthunt-backend.onrender.com${item.product.images[0]}`}
                                    alt={item.product.name}
                                    className="products-images"
                                />
                            </div>


                            <div className="item-details">
                                <h3>{item.product.name}</h3>
                                <div className='rentline'>
                                    <label>Rent: </label>
                                    <div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.duration}
                                            onChange={(e) => handleDurationChange(index, e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <select
                                            value={item.rentalType}
                                            onChange={(e) => handleRentTypeChange(index, e.target.value)}
                                        >
                                            {item.product.rentalPricing?.map((option) => (
                                                <option key={option._id} value={option.duration}>
                                                    {option.duration.charAt(0).toUpperCase() + option.duration.slice(1)} - ₹{option.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            placeholder='quantity'
                                        />
                                    </div>

                                    <div className='seucrdepo'>
                                        <p>Security Deposit:₹{item.product.securityDeposit}</p>

                                    </div>
                                </div>
                                <div>
                                    <strong>Rental Price:</strong> ₹{calculateRentPrice(item).toFixed(2)}
                                </div>

                                <div className="action-buttons">
                                    <button className="rent-now-btn" onClick={() => handleRentNow(item)}>
                                        Rent Now for  ₹{(calculateRentPrice(item) + item.product.securityDeposit)}
                                    </button>
                                    <button className="buy-now-btn" onClick={() => handleBuyNow(item)}>
                                        Buy for  ₹{item.product.actualPrice}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </div>
    );
};

export default CartPage;
