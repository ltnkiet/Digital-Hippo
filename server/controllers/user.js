const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwt");

//Đăng ký
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({
      success: false,
      msg: "Missing Input",
    });
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User is existed");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      msg: newUser
        ? "Register is successfully. Please login"
        : "Something went wrong",
    });
  }
});

//Đăng nhập
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
    const { password, role, refreshToken, ...user } = response.toObject();
    const accessToken = generateAccessToken(response._id, role);
    const newRefreshToken = generateRefreshToken(response._id);
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      user,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id }).select(
    "-refreshToken -password -role"
  );
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User Not Found",
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
  const { email } = req.query;
  if (!email) throw new Error("Missing Email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
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
      <a href=${process.env.SERVER_URL}/user/password/reset/${resetToken} 
        style="color:white; text-decoration-line: none; font-size: 14px; font-weight: 700">
          Reset Password
      </a>
    </button>
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">Nếu bạn không yêu cầu đặt lại mật khẩu, 
    thì có thể bỏ qua email này</p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">Cảm ơn bạn, </p>
    <p style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 14px">Digital Hippo Support Team!</p>
    <img src="https://res.cloudinary.com/ltnkiet/image/upload/v1700833580/Digital%20Hippo/s8h656rpjbs9iwocwvpq.png" style="width: 20rem"      alt="thumbnail">
  `;

  const data = { email, html };

  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
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
  if (!user) throw new Error("Invalid Reset Token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    success: user ? true : false,
    msg: user ? "Update Password" : "Something went wrong",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    user: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing input");
  const response = await User.findByIdAndDelete(_id).select(
    "-refreshToken -password -role"
  );
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Error",
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
    updatedUser: response ? response : "Error",
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
  const { pid, quantity } = req.body;
  if (!pid || !quantity) throw new Error("Missing input");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.products.toString() === pid
  );
  if (alreadyProduct) {
    //nếu trùng id thì thêm số lượng
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Cannot update quantity",
    });
  } else {
    // khác thì thêm sp mới
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { products: pid, quantity } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Error",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddressUser,
  updateCart,
};
