const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/signup", userController.createUser);
router.post("/login", userController.authenticateUser);

router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUser/:id", userController.getUserById);
router.get("/getUsersByRole/:role", userController.getUsersByRole);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/checkEmail/:email", userController.checkEmail);

module.exports = router;
