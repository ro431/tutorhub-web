const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");
const auth = require("../middleware/auth.middleware");

// ENROLLMENT APIs
router.post("/", auth, enrollmentController.createEnrollment);
router.get("/", auth, enrollmentController.getAllEnrollments);
router.get("/:id", auth, enrollmentController.getEnrollmentById);
router.get("/student/:id", auth, enrollmentController.getEnrollmentsByStudentId);
router.get("/teacher/:id", auth, enrollmentController.getEnrollmentsByTeacherId);
router.get("/course/:id", auth, enrollmentController.getEnrollmentsByCourseId);
router.get("/count/:id", auth, enrollmentController.getEnrollmentCountByCourse);
router.delete("/:id", auth, enrollmentController.deleteEnrollment);

// PENDING ENROLLMENT REQUESTS APIs
router.get("/pending/:teacherId", auth, enrollmentController.getPendingEnrollments);
router.put("/approve/:requestId", auth, enrollmentController.approveEnrollment);
router.put("/reject/:requestId", auth, enrollmentController.rejectEnrollment);

module.exports = router;
