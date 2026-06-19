const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");

router.get("/teacher", auth, notificationController.getTeacherNotifications);

module.exports = router;
