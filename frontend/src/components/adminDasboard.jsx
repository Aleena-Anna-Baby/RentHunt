import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import './adminDashboard.css';

export default function AdminDashboard() {
    const [overview, setOverview] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0

    });
    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await axiosInstance.get("/admin/overview",
                );
                setOverview(res.data);
            } catch (error) {
                console.error("Error fetching overview:", error);
            }
        };

        fetchOverview();
    }, []);
    return (
        <div className="dashDetails">
            <div className="total">
                <p >{overview.totalUsers}</p>
                <h2>Total Users</h2>

            </div>
            <div className="total">
                <p >{overview.totalProducts}</p>
                <h2 >Total Products</h2>

            </div>
            <div className="total">
                <p >{overview.totalOrders}</p>
                <h2 >Total Rented/Bought</h2>

            </div>
        </div>
    )
}