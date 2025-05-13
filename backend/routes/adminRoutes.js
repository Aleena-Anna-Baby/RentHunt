const express = require("express");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/auth"); // Import middleware
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});



router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments(); // <-- new

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders
    });
  } catch (error) {
    console.error('Admin Overview Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.get('/users', adminAuth,async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.post('/users/ban',adminAuth, async (req, res) => {
  try {
    const { userId, isBanned } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isBanned }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

module.exports = router;
