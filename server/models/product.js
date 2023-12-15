const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    brand: {
     type: mongoose.Schema.Types.ObjectId, ref: "Brand",
    require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, ref: "Category",
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    thumb: {
      type: String,
      require: true
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      require: true
    },
    rating: [
      {
        star: { type: Number },
        postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    description: {
      type: Array,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
