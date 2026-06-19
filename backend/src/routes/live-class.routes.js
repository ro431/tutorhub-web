const express = require("express");
const router = express.Router();
const liveClassController = require("../controllers/live-class.controller");
const auth = require("../middleware/auth.middleware");

// All routes require authentication
router.use(auth);

// Teacher routes
router.post("/schedule", liveClassController.createLiveClass);
router.get("/teacher", liveClassController.getTeacherLiveClasses);
router.put("/:id/status", liveClassController.updateStatus);
router.delete("/:id", liveClassController.deleteLiveClass);

// Student routes
router.get("/student", liveClassController.getStudentLiveClasses);

module.exports = router;
