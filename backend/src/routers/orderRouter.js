const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", orderController.createOrder);
router.get("/", authMiddleware, orderController.getAllOrder);
router.put("/:id", authMiddleware, orderController.updateOrder);
router.delete("/:id", authMiddleware, orderController.deleteOrder);



module.exports = router;
