const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReviewSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reviews", ReviewSchema);
