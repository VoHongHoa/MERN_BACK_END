const userController = require('.../controllers/User')
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("/middleware/auth");

router.get("/all", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/find-user", verifyToken, verifyAdmin, userController.findUser);
router.put("/all/:id", verifyToken, verifyAdmin, userController.updateUser);
router.get("/status", verifyToken, verifyAdmin, userController.statusAccounts);
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);


module.exports = router;