const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  if (!name) throw new Error("Missing inputs");
  const checkName = await Category.findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") },
  });
  if (checkName) throw new Error("Danh mục đã tồn tại")
  if (thumb) req.body.thumb = thumb;
  const response = await Category.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? "Thêm mới thành công" : "Lỗi hệ thống",
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "page"];
  excludeFields.forEach((el) => delete queries[el]);

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte|size)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueries = JSON.parse(queryString);

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_CATEGORY;
  const skip = (page - 1) * limit;
  // Query categories
  const queryCommand = Category.find(formatQueries).skip(skip).limit(limit);
  queryCommand
    .then(async (response) => {
      const counts = await Category.find(formatQueries).countDocuments();
      return res.status(200).json({
        success: true,
        counts,
        category: response,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  const response = await Category.findByIdAndUpdate(
    id, req.body, {new: true}
  );
  return res.json({
    success: response ? true : false,
    msg: response ? "Đã cập nhật danh mục" : "Lỗi hệ thống",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Category.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    msg: response ? "Đã xóa" : "Lỗi hệ thống",
  });
});



module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
