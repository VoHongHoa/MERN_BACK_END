const Review = require("../models/Review");
const mongoose = require("mongoose");

class ReviewController {
  getAllReviews = async (req, res) => {
    const { productId } = req.params;
    try {
      const reviews = await Review.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: { productId: mongoose.Types.ObjectId(productId) },
        },
      ]);
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  postReview = async (req, res) => {
    const { productId } = req.params;
    const { review } = req.body;
    const userId = req.userId;
    try {
      const postReview = new Review({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
        review,
      });

      await postReview.save();
      return res.json({ success: true, review: postReview });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { review } = req.body;
    const { userId } = req;
    try {
      const updateReview = await Review.findById(reviewId);
      if (updateReview.userId.toString() !== userId) {
        return res.json({
          success: false,
          message: "Không có quyền để sửa review này",
        });
      }
      updateReview.review = review;
      await updateReview.save();
      return res.json({ success: true, updateReview });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  deleteReview = async (req, res) => {
    const { userId } = req;
    const { reviewId } = req.params;
    try {
      const review = await Review.findById(reviewId);
      if (review.userId.toString() !== userId) {
        return res.json({ success: false, message: "Không có quyền để múc" });
      }
      await review.remove();
      return res.json({ success: true, message: "Xóa thành công" });
    } catch (err) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new ReviewController();
