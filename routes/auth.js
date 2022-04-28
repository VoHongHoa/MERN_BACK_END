const authController = require("../controllers/Auth");
const express = require("express");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// let user;
// router.get("/login/success", (req, res) => {
//   //console.log("check sess---------------", user);
//   if (!user) {
//     res.status(200).json({
//       success: false,
//       user: {},
//     });
//   } else {
//     res.status(200).json({
//       success: true,
//       user: user,
//     });
//   }
// res.status(200).json({
//   success: true,
//   user: req.session.user
// })
// User.findById(req.session.user._id)
//   .then((user) => {
//     req.user = user;
//     console.log(req.user);
//     next();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//});

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: "falied",
//   });
// });

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     //successRedirect: "http://localhost:3000",
//     failureRedirect: "/login/failed",
//   }),
//   async (req, res) => {
//     user = req.user;
//     //console.log(user);
//     res.redirect("http://localhost:3000");
//   }
// );

module.exports = router;
