const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { usersTest } = require("../utils/contants");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone)
    return res.status(400).json({
      success: false,
      msg: "Missing Input",
    });
  const user = await User.findOne({ email });
  if (user) throw new Error("Email này đã tồn tại.");
  else {
    const token = crypto.randomBytes(32).toString("hex");
    res.cookie(
      "data",
      { ...req.body, token },
      { httpOnly: true, maxAge: 3 * 60 * 1000 }
    );
    const html = `
      <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">
        Cảm ơn bạn vì đã chọn đồng hành cùng chúng tôi
      </p>
      <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">
        Chọn vào đây để hoàn tất quá trình đăng ký, yêu cầu này chỉ tồn tại 3 phút:
      </p>
      <button style="padding: 14px; background-color: #1E90FF; border-radius: 5px; border-style: none; cursor: pointer">
        <a href=${process.env.SERVER_URL}/user/register/verify/${token}
          style="color:white; text-decoration-line: none; font-size: 14px; font-weight: 700">
            Xác thực tài khoản
        </a>
      </button>
      <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">Digital Hippo Support Team!</p>
      <img src="https://res.cloudinary.com/ltnkiet/image/upload/v1701678830/DigitalHippo/thumb/lz2p2azdm5d1l8mxpmjl.png" style="width: 20rem" alt="thumbnail">`;
    await sendMail({ email, html, subject: "[Digital Hippo] E-Mail Verify" });
    return res.json({
      success: true,
      msg: "Thư báo đã được gửi đến email của bạn.",
    });
  }
});

const emailVerify = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { token } = req.params;
  if (!cookie || cookie?.data?.token !== token)
    return res.redirect(`${process.env.CLIENT_URL}/dang-ky/xac-thuc/that-bai`);
  const newUser = await User.create({
    name: cookie?.data?.name,
    phone: cookie?.data?.phone,
    email: cookie?.data?.email,
    password: cookie?.data?.password,
  });
  res.clearCookie("data");
  if (newUser)
    return res.redirect(
      `${process.env.CLIENT_URL}/dang-ky/xac-thuc/thanh-cong`
    );
  else
    return res.redirect(`${process.env.CLIENT_URL}/dang-ky/xac-thuc/that-bai`);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: "Missing Input",
    });
  }
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, refreshToken, ...user } = response.toObject();
    const accessToken = generateAccessToken(response._id, response.role);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      msg: "Đăng nhập thành công",
      user,
    });
  } else {
    throw new Error("Email hoặc mật khẩu không khớp!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id)
    .select("-refreshToken -password")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title thumb price color",
      },
    })
    .populate("wishlist");

  return res.status(200).json({
    success: user ? true : false,
    users: user ? user : "User Not Found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token invalid",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: " " },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    msg: "Logout is done",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing Email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email chưa được đăng ký");
  const resetToken = user.createPasswordChangedToken();
  await user.save();
  const html = `
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">
      Bạn nhận được email này vì bạn hoặc ai đó đã yêu cầu lấy lại mật khẩu
    </p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">
      Chọn vào đây để lấy lại mật khẩu, yêu cầu này sẽ mất hiệu lực sau 15 phút:
    </p>
    <button style="padding: 14px; background-color: #1E90FF; border-radius: 5px; border-style: none; cursor: pointer">
      <a href=${process.env.CLIENT_URL}/mat-khau/thay-doi/${resetToken}
        style="color:white; text-decoration-line: none; font-size: 14px; font-weight: 700">
          Cập nhật mật khẩu
      </a>
    </button>
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">Nếu bạn không yêu cầu đặt lại mật khẩu, 
    thì có thể bỏ qua email này</p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 14px">Cảm ơn bạn, </p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-size: 14px">Digital Hippo Support Team!</p>
    <img src="https://res.cloudinary.com/ltnkiet/image/upload/v1701678830/DigitalHippo/thumb/lz2p2azdm5d1l8mxpmjl.png" style="width: 20rem" alt="thumbnail">
  `;

  const data = {
    email,
    html,
    subject: "[Digital Hippo] Password Reset E-Mail",
  };

  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
    msg: "Thư báo đã được gửi tới email của bạn",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing Input");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    throw new Error("Đã hết thời gian thay đổi mật khẩu. Vui lòng thử lại!");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    success: user ? true : false,
    msg: user ? "Cập nhật thành công" : "Lỗi hệ thống",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  queries.role = 0;

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { name: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
  }
  let queryCommand = User.find(formatedQueries);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_TABLE;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  try {
    const users = await queryCommand.exec();
    const userIds = users.map((user) => user._id);

    const orderCounts = await Order.aggregate([
      { $match: { orderBy: { $in: userIds } } },
      {
        $group: {
          _id: "$orderBy",
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const orderCountMap = new Map(
      orderCounts.map((item) => [item._id.toString(), item.totalOrders])
    );
    const usersWithOrders = users.map((user) => {
      return {
        ...user.toObject(),
        totalOrders: orderCountMap.get(user._id.toString()) || 0,
      };
    });
    const totalCount = await User.countDocuments(formatedQueries);
    res.status(200).json({
      success: true,
      counts: totalCount,
      users: usersWithOrders,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

const createUsers = asyncHandler(async (req, res) => {
  const response = await User.create(usersTest);
  return res.status(200).json({
    success: response ? true : false,
    users: response ? response : "Some thing went wrong",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    msg: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, email, phonne, address } = req.body;
  const data = { name, email, phonne, address };
  if (req.file) data.avatar = req.file.path;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Updated." : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Cập nhật thành công" : "Lỗi hệ thống",
  });
});

const updateAddressUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  ).select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Error",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color, price, thumbnail, title } = req.body;
  if (!pid || !color) throw new Error("Missing input");
  const prod = await Product.findById(pid);
  if (!prod || prod.quantity < quantity) {
    return res.status(400).json({
      success: false,
      msg: "Số lượng sản phẩm không đủ!",
    });
  }
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (alreadyProduct) {
    //nếu trùng id thì thêm số lượng
    alreadyQty = parseInt(quantity) + parseInt(alreadyProduct.quantity);
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      {
        $set: {
          "cart.$.quantity": alreadyQty,
          "cart.$.price": price,
          "cart.$.thumbnail": thumbnail,
          "cart.$.title": title,
        },
      }
    );
    return res.status(200).json({
      success: response ? true : false,
      msg: response ? "Đã thêm vào giỏ" : "Không thể thêm vào giỏ",
    });
  } else {
    // khác thì thêm sp mới
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: { product: pid, quantity, color, price, thumbnail, title },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      msg: response
        ? "Đã thêm sản phẩm vào giỏ"
        : "Không thể thêm sản phẩm vào giỏ",
    });
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, color } = req.params;
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (!alreadyProduct)
    return res.status(200).json({
      success: true,
      msg: "Updated your cart",
    });
  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid, color } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? "Đã xóa" : "Some thing went wrong",
  });
});

const updateWishlist = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const alreadyInWishlist = user.wishlist?.find((el) => el.toString() === pid);
  if (alreadyInWishlist) {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      msg: response ? "Đã xóa khỏi mục yêu thích" : "Lỗi hệ thống!",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      msg: response ? "Đã thêm vào mục yêu thích" : "Lỗi hệ thống!",
    });
  }
});

module.exports = {
  register,
  emailVerify,
  login,
  getCurrent,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddressUser,
  updateCart,
  removeProductInCart,
  updateWishlist,
  createUsers,
};
