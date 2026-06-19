const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const studentController = require("../controllers/student.controller");

/* ===============================
   COURSES
================================ */

// Get all available courses
router.get(
  "/courses",
  auth,
  studentController.getAvailableCourses
);

/* ===============================
   STUDENT PROFILE
================================ */

// Create student profile
router.post(
  "/profile",
  auth,
  studentController.createStudentProfile
);

// Get my profile
router.get(
  "/profile",
  auth,
  studentController.getStudentProfileByUserId
);

// Update my profile
router.put(
  "/profile",
  auth,
  studentController.updateStudentProfile
);

// Delete my profile
router.delete(
  "/profile",
  auth,
  studentController.deleteStudentProfile
);

/* ===============================
   ENROLLMENTS
================================ */

// Get my enrollments
router.get(
  "/enrollments",
  auth,
  studentController.getStudentEnrollments
);

// Leave / cancel enrollment
router.delete(
  "/enrollments/:id",
  auth,
  studentController.leaveCourse
);

// Get my teachers
router.get(
  "/teachers",
  auth,
  studentController.getStudentTeachers
);

/* ===============================
   COURSE REQUESTS
================================ */

// Get my course requests
router.get(
  "/requests",
  auth,
  studentController.getStudentCourseRequests
);

// Send course request
router.post(
  "/requests",
  auth,
  studentController.sendCourseRequest
);

// Cancel course request
router.delete(
  "/requests/:id",
  auth,
  studentController.cancelCourseRequest
);

module.exports = router;
