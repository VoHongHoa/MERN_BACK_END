const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const token = require("../token/token");

register = async (req, res) => {
  //console.log("check req", req.body);
  const { username, email, password, fullname, address, phonenumber } =
    req.body;
  // const username = req.body.username
  // const password = req.body.password
  // const email =req.body.email

  // validation
  if (!username || !password || !email)
    return res.status(400).json({
      success: false,
      message: "Không được bỏ trống bất cứ trường nào.",
    });
  try {
    //check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(200)
        .json({ success: false, message: "Tên đăng nhập đã được sử dụng." });
    //all good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullname,
      address,
      phonenumber,
    });
    await newUser.save();
    //retun token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Tạo tài khoản thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// const updateRefreshToken = (username, refreshToken) => {
// 	User = User.map(user => {
// 		if (user.username === username)
// 			return {
// 				...user,
// 				refreshToken
// 			}

// 		return user
// 	})
// }

login = async (req, res) => {
  const { username, password } = req.body;
  //validate
  if (!username || !password)
    return res
      .status(200)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    //check for exitsting user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(200)
        .json({ success: false, message: "Incorrect username" });
    //username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });
    //ALL Good
    // const accessToken = jwt.sign(
    //     { userId: user._id },
    //     process.env.ACCESS_TOKEN_SECRET
    // )

    const tokens = token.generateTokens(user);
    res.json({ success: true, message: "User logged in successfully", tokens });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = { register, login };
