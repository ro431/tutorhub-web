const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth.middleware");

// COURSE APIs
router.post("/", auth, courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/with-schedules", courseController.getCoursesWithSchedules);
router.get("/:id", courseController.getCourseById);
router.get("/with-schedules/:id", courseController.getCourseWithSchedulesById);
router.get("/teacher/:id", courseController.getCoursesByTeacherId);
router.put("/:id", auth, courseController.updateCourse);
router.delete("/:id", auth, courseController.deleteCourse);

module.exports = router;