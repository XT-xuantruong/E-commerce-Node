const userService = require("../services/userService");
const orderService = require("../services/orderService");
const jwtService = require("../services/jwtService");

const orderUser = async (req, res) => {
  try {
    let userData;

    const contentType = req.headers["content-type"];

    if (contentType.includes("application/json")) {
      userData = req.body;
    } else if (contentType.includes("multipart/form-data")) {
      userData = req.fields;
    }
    const response = await orderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let userData;

    const contentType = req.headers["content-type"];
    if (contentType.includes("application/json")) {
      userData = req.body;
    }

    const { email, password } = userData;

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    const response = await userService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userid: " + userId);
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    if (req.file) {
      data.avatar = `/uploads/images/${req.file.filename}`;
    }
    const response = await userService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers;
    const response = await userService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await userService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};



module.exports = {
  orderUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
};
