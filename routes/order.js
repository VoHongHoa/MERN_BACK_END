const orderController = require("../controllers/Order");
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.post("/", verifyToken, orderController.createOrder);
router.put("/:id", verifyToken, verifyAdmin, orderController.updatedOrder);
router.delete("/:id", verifyToken, verifyAdmin, orderController.deleteOrder);
router.get(
  "/find/:userId",
  verifyToken,
  verifyAdmin,
  orderController.getUserOrders
);
router.get("/", verifyToken, verifyAdmin, orderController.getAllOrders);
router.get(
  "/income",
  verifyToken,
  verifyAdmin,
  orderController.getMonthlyIncome
);
router.get("/user-order", verifyToken, orderController.getOrderByUserId);
module.exports = router;
