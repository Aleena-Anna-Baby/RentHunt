const express = require("express");
const User =require ("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 


const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aleena2001baby@gmail.com", 
    pass: "pxawocyihtsfilir",  
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newUser.save();

    
    await transporter.sendMail({
      from: "aleena2001baby@gmail.com",
      to: email,
      subject: "OTP Verification for RentHunt",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`,
    });
console.log("OTP sent successfully to:", email);
    res.status(201).json({ message: "OTP sent to email", email });
  } catch (err) {
     console.error("REGISTER ERROR:");
    console.error(err);
    res.status(500).json({ message: "Registration failed",error: err.message, });
  }
});

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.isVerified)
        return res.status(400).json({ message: "User already verified" });
  
      if (user.otp !== otp)
        return res.status(400).json({ message: "Invalid OTP" });
  
      if (Date.now() > user.otpExpiry)
        return res.status(400).json({ message: "OTP has expired" });
  
      user.isVerified = true;
      user.otp = null;
      user.otpExpiry = null;
  
      await user.save();
  
      res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "OTP verification failed" });
    }
  });
  
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
  
      if (!user.isVerified)
        return res.status(403).json({ message: "Please verify your email first" });
  
      const token = jwt.sign({ id: user._id },   process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isBanned: user.isBanned,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  module.exports = router;
