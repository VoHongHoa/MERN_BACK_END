const userController = require("../controllers/User");
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");

router.put("/:id", verifyToken, userController.updateInfoUser);
router.get("/", verifyToken, userController.getInfoUser);
router.post("/reset-password", userController.resetPassword);
router.post("/changepassword", verifyToken, userController.changePassword);
router.post("/do-reset-password", userController.doChangePassword);
router.get("/find-user-by-email", userController.findUserByEmail);

//Admin
router.get("/all", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/find-user", verifyToken, verifyAdmin, userController.findUser);
router.put("/all/:id", verifyToken, verifyAdmin, userController.updateUser);
router.get("/status", verifyToken, verifyAdmin, userController.statusAccounts);
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
