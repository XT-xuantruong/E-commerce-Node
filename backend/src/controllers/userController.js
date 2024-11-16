const userService = require("../services/userService");
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const res = await userService.createUser();
    return res.status(201).json(res);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
};
