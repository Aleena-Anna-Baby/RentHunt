const User = require("../models/User");

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const user = await User.findById(userId);
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.status(200).json({ success: true,message: "Product added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add to wishlist" });
    }
};

const removeItemFromWishlist = async (req, res) => {
    const productId = req.params.productId;
  
    try {
      const user = await User.findById(req.user.id); 
      user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
      await user.save();
      
      res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error removing item' });
    }
  };
  

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate("wishlist");
        res.status(200).json({success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json({ success: false, message: "Failed to get wishlist" });
    }
};

const toggleWishlist = async (req, res) => {
    console.log("🔥 toggleWishlist hit"); 

    try {

        console.log("Request user:", req.user); 
        console.log("Request body:", req.body); 

        const userId = req.user.id;
        const productId = req.body.productId;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is missing" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const index = user.wishlist.indexOf(productId);

        if (index === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(index, 1);
        }

        await user.save();

        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error("Wishlist toggle error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = {
    addToWishlist,
    removeItemFromWishlist,
    getWishlist,
    toggleWishlist
};
