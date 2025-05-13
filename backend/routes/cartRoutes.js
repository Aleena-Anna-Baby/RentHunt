const express = require("express");
const router = express.Router();
const User = require('../models/User'); 
const {
     addToCart,
    getCart,
    removeFromCart,
    updateCart,
    clearCart } = require("../controllers/cartController");


router.get("/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("Received userId:", userId);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const user = await User.findById(userId).populate("cart.product");
      console.log("User fetched:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
  });
  


    
const cartController = require("../controllers/cartController");
console.log(cartController);  
console.log(cartController.addToCart);  
console.log('addToCart:', cartController.addToCart);

router.post("/add", addToCart);
router.post("/get", getCart);
router.get("/get", getCart);
router.post("/remove", removeFromCart);
router.put("/update", updateCart);
router.delete("/clear", clearCart);

module.exports = router;
