const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
// const productRouter = require("./productRouter");

const routes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  // app.use("/api/product", productRouter);
};

module.exports = routes;
