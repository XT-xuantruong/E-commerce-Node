const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const authMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization.split(" ")[1] ||
    req.headers.Authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    const { payload } = user;
    if (payload.isAdmin) {
      next();
    } else {
      console.log('long');
      return res.status(401).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  // console.log(req.headers.Authorization);

  const token =
    req.headers.authorization.split(" ")[1] ||
    req.headers.Authorization.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
    const { payload } = user;

    if (payload?.isAdmin || payload?.id == userId) {
      next();
    } else {
      return res.status(401).json({
        message: "The authentication",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
};
