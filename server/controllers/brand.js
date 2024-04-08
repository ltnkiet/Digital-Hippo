const Brand = require("../models/brand");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  if (!name) throw new Error("Lỗi hệ thống");
  const checkName = await Brand.findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") },
  });
  if (checkName) throw new Error("Thương hiệu đã tồn tại"); 
  if (thumb) req.body.thumb = thumb;
  const response = await Brand.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? "Thêm mới thành công" : "Lỗi hệ thống",
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "page"];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte|size)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueries = JSON.parse(queryString);
  const page = +req.query.page || 1;
  const limit = +req.query.limit;
  const skip = (page - 1) * limit;
  const queryCommand = Brand.find(formatQueries).skip(skip).limit(limit);
  queryCommand
    .then(async (response) => {
      const brandId = response.map((brand) => brand._id);
      const productCounts = await Product.aggregate([
        { $match: { brand: { $in: brandId } } },
        {
          $group: {
            _id: "$brand",
            totalProducts: { $sum: 1 },
          },
        },
      ]);
      const productCountMap = new Map(
        productCounts.map((item) => [item._id.toString(), item.totalProducts])
      );
      const brandsWithProductCount = response.map((brand) => {
        return {
          ...brand.toObject(),
          totalProducts: productCountMap.get(brand._id.toString()) || 0,
        };
      });
      const totalCount = await Brand.countDocuments(formatQueries);
      res.status(200).json({
        success: true,
        counts: totalCount,
        brands: brandsWithProductCount,
      });
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  const response = await Brand.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Cập nhật thành công" : "Lỗi hệ thống",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Brand.findByIdAndDelete(id);
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Đã xóa" : "Lỗi hệ thống",
  });
});

module.exports = {
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
