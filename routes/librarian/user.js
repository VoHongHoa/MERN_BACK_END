const userController = require('.../controllers/User')
const express = require("express");
const router = express.Router();
const { verifyToken, verifyLibrarian } = require("/middleware/auth");

router.get("/all", verifyToken, verifyLibrarian, userController.getAllUsers);
router.get("/find-user", verifyToken, verifyLibrarian, userController.findUser);
router.get("/status", verifyToken, verifyLibrarian, userController.statusAccounts);


module.exports = router;