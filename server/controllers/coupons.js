const Coupons = require("../models/coupons");
const asyncHandler = require("express-async-handler");

const createCoupons = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing Input");
  const response = await Coupons.create({
    ...req.body,
    expiry: Date.now() + +expiry * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    coupons: response ? response : "Cannot created coupons",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupons.find();
  return res.json({
    success: response ? true : false,
    coupons: response ? response : "Cannot get coupons",
  });
});

const updateCoupons = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupons.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    coupons: response ? response : "Cannot get coupons",
  });
});

const deleteCoupons = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupons.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    coupons: response ? "Deleted Success" : "Cannot delete coupons",
  });
});

module.exports = { createCoupons, getCoupons, updateCoupons, deleteCoupons };
