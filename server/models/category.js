const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    thumb: {
      type: String,
    },
    brand: {
      type: Array,
      require: true,
    },
    // brands: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Brand",
    //     require: true,
    //   },
    // ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Category", categorySchema);
