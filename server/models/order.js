const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
    },
  ],
  coupons: {
    type: mongoose.Types.ObjectId,
    ref: "Coupons",
  },
  status: {
    type: Int16Array,
    default: "processing",
    enum: ["cancelled", "processing", "delivering", "success"],
  },
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  total: Number,
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
