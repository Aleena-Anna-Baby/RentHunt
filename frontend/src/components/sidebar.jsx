import "./sidebar.css";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdOutlineProductionQuantityLimits, MdPassword } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export default function Sidebar({ onLogout }) {

    
    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <nav>
                <NavLink to="/admin/adminDashboard" className={({ isActive }) => isActive ? "active" : ""}>
                    <MdDashboard className="icon" /> Dashboard
                </NavLink>
                <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
                    <MdOutlineProductionQuantityLimits className="icon" /> Product Management
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaUsers className="icon" /> User Management
                </NavLink>
              


                <button className="logout-botn" onClick={onLogout}>
                    <IoLogOut className="icon" /> Logout
                </button>
            </nav>

        
        </div>
    );
}
