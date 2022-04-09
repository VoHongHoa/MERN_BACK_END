const userController = require('.../controllers/User')
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("/middleware/auth");

router.get("/all", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/find-user", verifyToken, verifyAdmin, userController.findUser);
router.get("/status", verifyToken, verifyAdmin, userController.statusAccounts);


module.exports = router;