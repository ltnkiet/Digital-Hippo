const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const brandRouter = require("./brand");
const couponsRouter = require('./coupons')
const orderRouter = require("./order")
const insertRouter = require('./insert')

const { errHandler, notFound } = require("../middlewares/errHandler");

const initRouters = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupons", couponsRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insert", insertRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRouters;
