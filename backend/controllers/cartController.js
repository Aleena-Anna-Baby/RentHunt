const User = require("../models/User");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const {userId, productId, quantity, rentType } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
          }
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const existingItem = user.cart.find(item => {
            return item.product.toString() === productId && item.rentType === rentType
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({product: productId, quantity,rentType   });
        }

        await user.save();
        res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }

};

const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log("User ID received:", userId);

        const user = await User.findById(userId).populate("cart.product");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart.forEach(item => {
            console.log(`Product: ${item.product.name}`);
            console.log('Rental Pricing:', item.product.rentalPricing);
        });

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};



const removeFromCart = async (req, res) => {
    try {
        const { userId, productId, rentType } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = user.cart.filter(
            item => !(item.product.toString() === productId && item.rentType === rentType)
        );

        await user.save();
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
};

const updateCart = async (req, res) => {
    try {
        const { userId, productId, rentType, quantity } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const item = user.cart.find(
            item => item.product.toString() === productId && item.rentType === rentType
        );

        if (item) {
            item.quantity = quantity;
            await user.save();
            res.status(200).json({ message: "Cart updated successfully" });
        } else {
            res.status(404).json({ message: "Cart item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error });
    }
};

const clearCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.cart = [];
        await user.save();
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};





module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
    clearCart
  };
  