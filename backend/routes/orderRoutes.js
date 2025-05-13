const express = require("express");
const Order = require('../models/Order'); 

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, productId, rentType, duration, totalAmount, paymentId } = req.body;

    console.log("Order data received:", req.body); 

    const order = new Order({
      userId,
      productId,
      rentType,
      duration,
      totalAmount,
      paymentId,
    });

    await order.save();
    res.status(201).json({ message: "Order saved successfully", order });
  } catch (err) {
    console.error("Order save error:", err);  
    res.status(500).json({ message: "Failed to save order", error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("productId");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});




module.exports = router;
