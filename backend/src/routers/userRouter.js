const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/getall",authMiddleware, userController.getAllUser);
router.get("/detail-user/:id",authUserMiddleware, userController.getDetailUser);
router.get("/refresh-token", userController.refreshToken);



module.exports = router;