const Coupons = require("../models/coupons");
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
  const newCoupons = {
    name,
    discount,
    startDate: new Date(),
    endDate: new Date(),
    quantity,
  };
  const response = await Coupons.create(newCoupons);
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
  // Query categories
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
  if (req.body.startDate) {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (req.body.endDate) {
    req.body.endDate = new Date(req.body.endDate);
  }
  const response = await Coupons.findByIdAndUpdate(cid, req.body, {
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
