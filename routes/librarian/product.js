const productController = require('.../controllers/Product');
const express = require("express");
const router = express.Router();
const { verifyToken, verifyLibrarian } = require("/middleware/auth");

router.post("/", verifyToken, verifyLibrarian, productController.createProduct);
router.put("/:id", verifyToken, verifyLibrarian, productController.updatedProduct);
router.delete("/:id", verifyToken, verifyLibrarian, productController.deleteProduct);
module.exports = router