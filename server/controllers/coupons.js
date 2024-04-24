const Coupons = require("../models/coupons");
const Order = require("../models/order");
const asyncHandler = require("express-async-handler");

const createCoupons = asyncHandler(async (req, res) => {
  const { name, discount, startDate, endDate, quantity } = req.body;
  if (!name || !discount || !startDate || !endDate || !quantity)
    throw new Error("Lỗi hệ thống");
  if (discount > 100) {
    return res.status(400).json({
      success: false,
      msg: "Không thể giảm quá 100%",
    });
  }
  const existingCoupons = await Coupons.findOne({ name });
  if (existingCoupons) {
    return res.status(400).json({
      success: false,
      msg: "Khuyến mãi này đã tồn tại",
    });
  }
  const response = await Coupons.create(req.body);
  return res.json({
    success: response ? true : false,
    msg: response ? "Tạo thành công" : "Lỗi hệ thống",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
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
  const limit = +req.query.limit;
  const skip = (page - 1) * limit;

  const queryCommand = Coupons.find(formatQueries).skip(skip).limit(limit);
  queryCommand
    .then(async (response) => {
      const counts = await Coupons.find(formatQueries).countDocuments();
      return res.status(200).json({
        success: true,
        counts,
        coupons: response,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const updateCoupons = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
  if (req.body.discount && req.body.discount > 100) {
    return res.status(400).json({
      success: false,
      msg: "Không thể giảm quá 100%",
    });
  }
  let status = 0;
  const { startDate, endDate } = req.body;
  const currentDate = new Date();
  if (endDate && new Date(endDate) < currentDate) {
    status = 2;
  } else if (startDate && new Date(startDate) <= currentDate) {
    status = 1;
  }
  const updateData = { ...req.body, status };
  const response = await Coupons.findByIdAndUpdate(cid, updateData, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    msg: response ? "Cập nhật thành công" : "Lỗi hệ thống",
  });
});

const deleteCoupons = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupons.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    coupons: response ? "Đã xóa" : "Lỗi hệ thống",
  });
});

module.exports = { createCoupons, getCoupons, updateCoupons, deleteCoupons };
