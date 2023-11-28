const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          msg: "Invalid Access Token",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      msg: "Require Authentication",
    });
  }
});

const isEmployee = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "employee" || role !== "admin")
    return res.status(401).json({
      success: false,
      msg: "Require employee role",
    });
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      msg: "Require admin role",
    });
  next();
});


module.exports = { verifyAccessToken, isEmployee, isAdmin };
