const Order = require("../models/order");
const User = require("../models/user");
const Coupons = require("../models/coupons");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

const createOrderV2 = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address, status, coupons } = req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const data = { products, total, orderBy: _id, coupons: coupons || null };

  if (coupons) {
    const selectedCoupon = await Coupons.findById(coupons);
    if (selectedCoupon.quantity <= 0) {
      return res.status(200).json({
        success: false,
        msg: "Mã giảm giá đã hết lượt",
      });
    }
    data.coupons = coupons;
    await Coupons.findByIdAndUpdate(coupons, {
      $inc: { quantity: -1, usageCount: 1 },
    });
  }

  if (status) data.status = status;
  const rs = await Order.create(data);

  return res.json({
    success: rs ? true : false,
    msg: rs ? rs : "Lỗi hệ thống",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  const order = await Order.findById(oid).populate({
    path: "products",
    populate: {
      path: "product",
    },
  });
  if (!status) throw new Error("Missing Input");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  if (response.status === 3) {
    for (const { product: productId, quantity } of order.products) {
      const prod = await Product.findById(productId);
      if (prod) {
        await Product.findByIdAndUpdate(productId, {
            $inc: { sold: quantity, quantity: -quantity },
          },
          { new: true }
        );
      }
    }
  }
  return res.status(200).json({
    success: response ? true : false,
    msg: response
      ? "Đã cập nhật trạng thái đơn hàng"
      : "Sự cố hệ thống! Vui lòng thử lại",
    order: response ? response : "Sự cố hệ thống! Vui lòng thử lại",
  });
});

const cancelOrder = asyncHandler(async(req, res) => {
  const { oid } = req.params;
  const { _id } = req.user;
  
  const order = await Order.findById(oid);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      msg: "Không tìm thấy đơn hàng",
    });
  }

  if (order.orderBy.toString() !== _id) {
    return res.status(200).json({
      success: false,
      msg: "Bạn không có quyền hủy đơn hàng này",
    });
  }

  if (order.status === 0 || order.status === 2 || order.status === 3 || order.status === 4) {
    return res.status(200).json({
      success: false,
      msg: "Không thể hủy đơn hàng khi đơn hàng đã được xác nhận",
    });
  }

  const createdAtTime = new Date(order.createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - createdAtTime;
  const cancelTimeLimit = 5 * 60 * 1000;
  
  if (timeDiff > cancelTimeLimit) {
    return res.status(200).json({
      success: false,
      msg: "Không thể hủy đơn hàng sau 5 phút kể từ thời gian tạo đơn hàng",
    });
  }


  order.status = 0; 
  await order.save();

  return res.status(200).json({
    success: true,
    msg: "Đã hủy đơn hàng thành công",
    order: order,
  });
});


const getUserOrder = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { _id } = req.user;
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  const qr = { ...formatedQueries, orderBy: _id };
  let queryCommand = Order.find(qr);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else queryCommand = queryCommand.sort("-createdAt");

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else queryCommand = queryCommand.select("-__v");

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  queryCommand
    .then(async (response) => {
      const counts = await Order.find(qr).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        orderList: response ? response : "Lỗi hệ thống",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const getOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  const qr = { ...formatedQueries };
  let queryCommand = Order.find(qr).populate("orderBy");

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else queryCommand = queryCommand.sort("-createdAt");

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else queryCommand = queryCommand.select("-__v");
  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // Execute query
  // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
  queryCommand
    .then(async (response) => {
      const counts = await Order.find(qr).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        orderList: response ? response : "Lỗi hệ thống",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

function getCountPreviousDay(count = 1, date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - count);
  return previous;
}
const getDashboard = asyncHandler(async (req, res) => {
  const { to, from, type } = req.query;
  const format = type === "MTH" ? "%Y-%m" : "%Y-%m-%d";
  const start = from || getCountPreviousDay(7, new Date(to));
  const end = to || getCountPreviousDay(0);
  const [users, totalSuccess, totalFailed, soldQuantities, chartData, pieData] =
    await Promise.all([
      // Thống kê Người dùng mới
      User.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]),
      // Tính tổng số đơn đã thanh toán thành công và chưa thanh toán
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: 3 },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: "$total" },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: 1 },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: "$total" },
          },
        },
      ]),
      // Tính tổng số sản phẩm đã báns
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: 3 },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: { $sum: "$products.quantity" } },
          },
        },
      ]),
      // Tính tổng doanh thu theo thời gian và trạng thái
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
              { status: 3 },
            ],
          },
        },
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: {
              $dateToString: {
                format,
                date: "$createdAt",
              },
            },
            sum: { $sum: "$total" },
          },
        },
        {
          $project: {
            date: "$_id",
            sum: 1,
            _id: 0,
          },
        },
      ]),
      // Tính tổng số đơn hàng theo trạng thái
      Order.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: new Date(start) } },
              { createdAt: { $lte: new Date(end) } },
            ],
          },
        },
        { $unwind: "$status" },
        {
          $group: {
            _id: "$status",
            sum: { $sum: 1 },
          },
        },
        {
          $project: {
            status: "$_id",
            sum: 1,
            _id: 0,
          },
        },
      ]),
    ]);
  return res.json({
    success: true,
    data: {
      users,
      totalSuccess,
      totalFailed,
      soldQuantities,
      chartData,
      pieData,
    },
  });
});

module.exports = {
  createOrderV2,
  updateStatus,
  getUserOrder,
  getOrders,
  getDashboard,
  cancelOrder,
};
