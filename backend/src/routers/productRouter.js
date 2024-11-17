const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getDetailProduct);
router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
