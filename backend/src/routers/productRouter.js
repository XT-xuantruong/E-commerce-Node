const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  uploadFiles,
  uploadSingleImage,
} = require("../middleware/uploadMiddleware");
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getDetailProduct);
router.post("/", authMiddleware, uploadFiles, productController.createProduct);
router.put(
  "/:id",
  authMiddleware,
  uploadFiles,
  productController.updateProduct
);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
