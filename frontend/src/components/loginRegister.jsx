import { Player } from "@lottiefiles/react-lottie-player";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";

import "./loginRegister.css";
import axiosInstance from "../components/axiosInstance";



const LoginRegister = () => {
    const nav = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
    });


   


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            if (!showOtpInput) {
                try {
                    const res = await axiosInstance.post("/auth/register", {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    });
                    alert(res.data.message);
                    setShowOtpInput(true);
                } catch (err) {
                    alert(err.response?.data?.message || "Registration failed");
                }
            } else {
                try {
                    const res = await axiosInstance.post("/auth/verify-otp", {
                        email: formData.email,
                        otp: formData.otp,
                    });
                    alert(res.data.message);
                    setShowOtpInput(false);
                    setIsRegister(false); 
                    setFormData({ name: "", email: "", password: "", otp: "" });
                } catch (err) {
                    alert(err.response?.data?.message || "OTP verification failed");
                }
            }
        } else {
            try {
                const res = await axiosInstance.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                if (res.data.user.isBanned) {
                    alert("Your account is banned.");
                    return;
                  }

                alert(res.data.message);
                nav("/")
                localStorage.setItem("token", res.data.token); 
                localStorage.setItem("user", JSON.stringify(res.data.user)); 
                localStorage.setItem("userId", res.data.user.id); 

                console.log("Login full response:", res.data);
                console.log("User:", res.data.user);
                console.log("User ID:", res.data.user.id);
                
                
            } catch (err) {
                console.log("Login error:", err.response); 
                alert(err.response?.data?.message || "Login failed");
            }
        }
    };




    












    return (
        <div className={`container ${isRegister ? "register-mode" : ""}`}>
            <div className="form-container">
                <div className="animation-section">
                    <Player
                        src="/loginAnimation.json"
                        background="transparent"
                        speed={1}
                        loop
                        autoplay
                        className="lottie-player"
                    />
                </div>



                <div className="form-section">
                    <h2>{isRegister ? "Register" : "Login"}</h2>
                    <form onSubmit={handleSubmit}>
                        {isRegister && !showOtpInput && (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaRegEye className="regpassicon"/> : <LuEyeClosed className="regpassicon"/>}
                                </span>
                            </>
                        )}

                        {isRegister && showOtpInput && (
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                            />
                        )}

                        {!isRegister && (
                            <>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaRegEye className="passicon" /> : <LuEyeClosed className="passicon"/>}
                                </span>
                                <p className="forgot-password" onClick={() => alert("Redirect to Forgot Password Page")}>
                                    Forgot Password?
                                </p>

                            </>
                        )}

                        <button type="submit">
                            {isRegister
                                ? showOtpInput
                                    ? "Verify OTP"
                                    : "Register"
                                : "Login"}
                        </button>
                    </form>
                    <p>
                        {isRegister
                            ? "Already have an account?"
                            : "Don't have an account?"}{" "}
                        <span
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setShowOtpInput(false);
                                setFormData({
                                    name: "",
                                    email: "",
                                    password: "",
                                    otp: "",
                                });
                            }}
                        >
                            {isRegister ? "Login" : "Register"}
                        </span>
                    </p>
                </div>


                
            </div>
        </div>
    );
};

export default LoginRegister;
