import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import "./UserOrders.css"
const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");




    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get(`/orders/user/${userId}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) {
        return <div >Loading orders...</div>;
    }

    if (orders.length === 0) {
        return <div >No orders found.</div>;
    }

    return (
        <div className="order-page">

            <h1 className="order">My Orders</h1>
            
            <div className="order-card">
                {orders.map((order, index) => (

                    <div key={index} className="order-details">
                        <div className='card-image'>

                            {order.productId?.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={`https://renthunt-backend.onrender.com${image}`}
                                    alt={order.name}
                                    className={`product-images ${index !== 0 ? 'product-images-hover' : ''}`}
                                />
                            ))}
                        </div>
                        <h3 >{order.productId?.name || "Unknown Product"}</h3>

                        <p>Total: ₹{order.totalAmount}</p>
                        <p className="orderId">Order ID: {order._id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
