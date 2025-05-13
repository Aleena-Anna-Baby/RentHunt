import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import "./admin.css";

export default function Admin() {
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("Access Denied! Please log in as Admin.");
            nav("/");
        }
    }, [nav]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("adminToken");
            alert("Logged out successfully!");
            nav("/");
        }
    };

    return (
        <div className="admin-container">
            <Sidebar onLogout={handleLogout} />
            <div className="admin-content">
                {location.pathname === "/admin" && <h1>Welcome, Admin!</h1>}  
                <Outlet /> 
            </div>
        </div>
    );
}
