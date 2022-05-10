const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/Review");
const { verifyToken } = require("../middleware/auth");

router.get("/:productId", ReviewController.getAllReviews);
router.post("/:productId", verifyToken, ReviewController.postReview);
router.put("/:reviewId", verifyToken, ReviewController.updateReview);
router.delete("/:reviewId", verifyToken, ReviewController.deleteReview);

module.exports = router;
