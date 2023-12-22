const Order = require("../models/order");
const User = require("../models/user");
const Coupons = require("../models/coupons");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupons } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.products", "title price");
  if (!userCart.cart || userCart.cart.length === 0) {
    throw new Error("Cart is empty");
  };
  const products = userCart?.cart?.map((el) => ({
    product: el.products.name,
    count: el.quantity,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.products.price * el.quantity + sum, 0
  );
  const createData = { products, total, orderBy: _id, coupons };
  if (coupons) {
    const seletedCoupons = await Coupons.findById(coupons);
    if (seletedCoupons.expiry && new Date(seletedCoupons.expiry) < new Date()) {
      throw new Error("Coupons has expired");
    };
    total = Math.round((total * (1 - +seletedCoupons?.discount / 100)) / 1000) * 1000 || total;
    createData.total = total;
    createData.coupons = coupons;
  }
  const result = await Order.create(createData);
  if (result) {
    await User.findByIdAndUpdate(_id, { $set: { cart: [] } });
  };
  return res.status(200).json({
    success: result ? true : false,
    order: result ? result : "Error",
    userCart,
  });
});

const createOrderbyAdmin = asyncHandler(async (req, res) => {})

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing Input");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    order: response ? response : "Error",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.status(200).json({
    success: response ? true : false,
    order: response ? response : "cannot get order",
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.status(200).json({
    success: response ? true : false,
    order: response ? response : "cannot get order",
  });
});

module.exports = { createOrder, createOrderbyAdmin, updateStatus, getUserOrder, getOrder };
