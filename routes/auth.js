const authController = require("../controllers/Auth");
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfully",
      user: req.user,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "falied",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
