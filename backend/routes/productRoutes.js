const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addProduct,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/add", upload.array("image", 5), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById); 
router.get("/category/:category", getProductsByCategory); 
router.get("/subcategory/:subcategory", getProductsBySubcategory);
router.put("/:id", upload.array("image", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
