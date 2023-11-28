const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await Category.create(req.body);
  return res.json({
    success: response ? true : false,
    category: response ? response : "Cannot created category",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const response = await Category.find();
  return res.json({
    success: response ? true : false,
    category: response ? response : "Cannot get category",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndUpdate(cid, req.body, {
    new: true,
  }).select("name _id");
  return res.json({
    success: response ? true : false,
    category: response ? response : "Cannot update category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    category: response ? "deleted success" : "Cannot deleted category",
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (!req.file) throw new Error("Missing Input");
  const response = await Category.findByIdAndUpdate(cid, {
    $push: { image: req.file.path },
  });
  return res.status(200).json({
    status: response ? true : false,
    categoryImage: response ? response : "Cannot upload thumbnail",
  });
});

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
};
