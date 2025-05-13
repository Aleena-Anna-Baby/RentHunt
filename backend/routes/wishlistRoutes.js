const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/userAuth"); 
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  addToWishlist,
  removeItemFromWishlist,
    getWishlist,
  toggleWishlist,
} = require("../controllers/wishlistController");
console.log(" Wishlist route file loaded");





router.get("/test", (req, res) => {
  res.send("Wishlist route is working");
});





router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
},getWishlist);
  







router.post('/toggle', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
,toggleWishlist);

router.post("/add/:productId", verifyToken, addToWishlist);

router.delete('/:productId',verifyToken, removeItemFromWishlist);

module.exports = router;
