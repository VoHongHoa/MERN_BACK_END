const productController = require("../controllers/Product");
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/", verifyToken, verifyAdmin, productController.createProduct);
router.put("/:id", verifyToken, verifyAdmin, productController.updatedProduct);
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  productController.deleteProduct
);
router.get("/find", productController.findProduct);
router.get("/", productController.getAllProduct);
router.get("/get-top-product", productController.getTopProduct);
router.get("/get-product-filter", productController.getProductByFilter);

module.exports = router;
