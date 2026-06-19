const adminService = require("../services/admin.service");

async function getStats(req, res) {
    try {
        const stats = await adminService.getStats();
        res.json({ status: true, data: stats });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getAllTeachers(req, res) {
    try {
        const teachers = await adminService.getAllTeachers();
        res.json({ status: true, data: teachers });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getAllStudents(req, res) {
    try {
        const students = await adminService.getAllStudents();
        res.json({ status: true, data: students });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getAllCourses(req, res) {
    try {
        const courses = await adminService.getAllCourses();
        res.json({ status: true, data: courses });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getEnrollmentMapping(req, res) {
    try {
        const mapping = await adminService.getEnrollmentMapping();
        res.json({ status: true, data: mapping });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function updateProfile(req, res) {
    try {
        const adminId = req.user.id; // From auth middleware
        const result = await adminService.updateProfile(adminId, req.body);
        res.json({ status: true, msg: "Profile updated successfully", data: result });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await adminService.deleteUser(userId);
        res.json({ status: true, msg: "User and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

module.exports = {
    getStats,
    getAllTeachers,
    getAllStudents,
    getAllCourses,
    getEnrollmentMapping,
    updateProfile,
    deleteUser
};
