const notFound = (req, res, next) => {
  const error = new Error(`Router ${req.originalUrl} not found`);
  res.status(404);
  next(error);
};

const errHandler = (err, req, res, next) => {
  const statusCode = req.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    msg: err?.message,
  });
};

module.exports = {
  notFound, errHandler
}
