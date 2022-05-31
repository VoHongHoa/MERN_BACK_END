const jwt = require("jsonwebtoken");
exports.generateTokens = (payload) => {
  const user = payload;
  // const accessToken = jwt.sign({ userId:user._id } ,process.env.ACCESS_TOKEN_SECRET,
  //     {expiresIn:'15s'})
  // const refreshToken=jwt.sign({ userId:user._id } ,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1h'})
  // return {accessToken,refreshToken}

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  // const refreshToken = jwt.sign(
  //   { userId: user._id, role: user.role },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   { expiresIn: "1d" }
  // );

  return { accessToken };
};
