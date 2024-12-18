const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/logout", authUserMiddleware, userController.logoutUser);
router.put("/update-user/:id", uploadAvatar, userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/getall", authMiddleware, userController.getAllUser);
router.get(
  "/detail-user/:id",
  authUserMiddleware,
  userController.getDetailUser
);
router.get("/refresh-token", userController.refreshToken);

module.exports = router;
