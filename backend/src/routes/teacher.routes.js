const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");

// TEACHER PROFILE APIs
router.post("/profile", auth, teacherController.createTeacherProfile);
router.get("/profile/user/:id", teacherController.getTeacherProfileByUserId);
router.get("/profile/:id", teacherController.getTeacherProfileById);
router.get("/profiles", teacherController.getAllTeacherProfiles);
router.put("/profile/:id", auth, teacherController.updateTeacherProfile);
router.delete("/profile/:id", auth, teacherController.deleteTeacherProfile);

module.exports = router;