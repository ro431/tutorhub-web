const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ status: false, msg: "Access denied. Admin only." });
    }
};

router.use(auth);
router.use(isAdmin);

router.get("/stats", adminController.getStats);
router.get("/teachers", adminController.getAllTeachers);
router.get("/students", adminController.getAllStudents);
router.get("/courses", adminController.getAllCourses);
router.get("/enrollments", adminController.getEnrollmentMapping);
router.put("/profile", adminController.updateProfile);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
