const Product = require("../models/Product");

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};


// Get products by category
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category: category });

    if (!products.length) {
      return res.status(404).json({ message: `No products found in category: ${category}` });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get products by subcategory
const getProductsBySubcategory = async (req, res) => {
  const { subcategory } = req.params;

  try {
    const products = await Product.find({ subcategory: subcategory });

    if (!products.length) {
      return res.status(404).json({ message: `No products found in subcategory: ${subcategory}` });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



//  Add Product
const addProduct = async (req, res) => {
  try {
    console.log("Request received for adding product...");
    console.log("Uploaded files:", req.files);
    console.log("Raw rentalPricing received:", req.body.rentalPricing);

    const { name, category, subcategory, description, rentalPricing, actualPrice, securityDeposit, 
     } = req.body;

    let parsedRentalPricing = [];
    if (req.body.rentalPricing) {
      try {
        parsedRentalPricing = JSON.parse(req.body.rentalPricing);
      } catch (error) {
        return res.status(400).json({ message: "Invalid rentalPricing format. Must be a JSON array." });
      }
    }

    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      actualPrice,
      category,
      subcategory,
      description,
      rentalPricing: parsedRentalPricing,
      securityDeposit: Number(securityDeposit),
      images,
    });

    console.log("Saving product:", newProduct);

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ message: error.message });
  }
};

//  Fetch All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, subcategory, description, rentalPricing, actualPrice, securityDeposit,
       } = req.body;

    let parsedRentalPricing = [];
    if (req.body.rentalPricing) {
      try {
        parsedRentalPricing = JSON.parse(req.body.rentalPricing);
      } catch (error) {
        return res.status(400).json({ message: "Invalid rentalPricing format. Must be a JSON array." });
      }
    }

    let updateFields = {
      name,
      category,
      subcategory,
      description,
      actualPrice,
      rentalPricing: parsedRentalPricing,
      securityDeposit: Number(securityDeposit),
    };

    if (req.files.length > 0) {
      const images = req.files.map((file) => `/uploads/${file.filename}`);
      updateFields.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

//  Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

module.exports = { addProduct, getProducts, getProductById, getProductsByCategory, getProductsBySubcategory, updateProduct, deleteProduct };
