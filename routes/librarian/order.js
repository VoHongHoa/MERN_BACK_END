const orderController = require('../../controllers/Order');
const express = require("express");
const router = express.Router();
const { verifyToken, verifyLibrarian } = require("/middleware/auth");

router.post("/", verifyToken, orderController.createOrder);
router.put("/:id", verifyToken, verifyLibrarian, orderController.updatedOrder);
router.delete("/:id", verifyToken, verifyLibrarian, orderController.deleteOrder);
router.get("/find/:userId", verifyToken, verifyLibrarian, orderController.getUserOrders);
router.get("/", verifyToken, verifyLibrarian, orderController.getAllOrders);
router.get("/income", verifyToken, verifyLibrarian, orderController.getMonthlyIncome);

module.exports = router;
