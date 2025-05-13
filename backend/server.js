const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const authRoutes=require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const cartRoutes=require("./routes/cartRoutes.js")
const orderRoutes=require("./routes/orderRoutes.js")
dotenv.config();
const app = express();
const paymentRoutes = require('./routes/paymentRoutes');

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); 

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);  
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart",cartRoutes)
console.log(" Mounted /api/wishlist");
app.use('/api', paymentRoutes);
app.use("/orders", orderRoutes);

app.use("/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
