import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Admin from "./components/admin";
import ProductPage from "./components/productPage";
import ProductManagement from "./components/ProductManagement";
import ViewProduct from "./components/viewProduct";
import LoginRegister from "./components/loginRegister";
import UserManagement from "./components/UserManagement";
import Wishlist from "./components/wishlist";
import CartPage from "./components/cartPage";
import PaymentPage from "./components/PaymentPage";
import AdminDashboard from "./components/adminDasboard";
import UserOrders from "./components/UserOrders";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/category/:category" element={<ProductPage />} />
        <Route path="/subcategory/:subcategory" element={<ProductPage />} />
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cartPage" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/loginRegister" element={<LoginRegister />} />
        <Route path="/my-orders" element={<UserOrders />} />

        <Route path="/admin" element={<Admin />}>
          <Route path="adminDashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </div>
  );
}