const productController = require('../controllers/Product');
const express = require("express");
const router = express.Router();

router.get("/find", productController.findProduct);
router.get("/", productController.getAllProduct);
router.get("/get-top-product", productController.getTopProduct);

module.exports = router;
