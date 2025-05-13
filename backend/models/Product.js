const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String },
  actualPrice: { type: Number, required: true }, 

  images: [{ type: String }],

  rentalPricing: [
    {
      duration: { type: String, enum: ["day", "week", "month"], required: true },
      price: { type: Number, required: true }
    }
  ],

  purchasePrice: { type: Number, required: false },

  stock: { type: Number, required: true, default: 1 },

  securityDeposit: {
    refundableDeposit: { type: Number, required: false },
    returnedDate: { type: Date, required: false },
    dueDate: { type: Date, required: false }
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  seller: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    contact: { type: String, required: false }
  },

  availability: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
