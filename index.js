require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
// const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern.b3jpg.mongodb.net/mern?retryWrites=true&w=majority`
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

app.use(bodyParser.urlencoded({ limit: "50mb" }, { extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,DELETE,HEAD,OPTIONS,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  // Pass to next layer of middleware
  next();
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,DELETE,HEAD,OPTIONS,POST,PUT"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
