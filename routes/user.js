const userController = require('../controllers/User')
const express = require("express");
const router = express.Router();
const { verifyToken} = require("../middleware/auth");

router.put("/:id", verifyToken, userController.updateInfoUser);
router.get("/", verifyToken, userController.getInfoUser);
router.post("/reset-password", userController.resetPassword);
router.post("/changepassword", verifyToken, userController.changePassword);


module.exports = router;