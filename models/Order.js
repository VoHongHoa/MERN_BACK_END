const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "Đang giao hàng" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);
