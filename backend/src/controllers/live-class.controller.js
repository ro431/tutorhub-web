const liveClassService = require("../services/live-class.service");

async function createLiveClass(req, res) {
    try {
        const data = { ...req.body, teacher_id: req.user.id };
        const result = await liveClassService.createLiveClass(data);
        res.json({ status: true, msg: "Live class scheduled successfully", data: result });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
}

async function getTeacherLiveClasses(req, res) {
    try {
        const result = await liveClassService.getLiveClassesByTeacher(req.user.id);
        res.json({ status: true, data: result });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
}

async function getStudentLiveClasses(req, res) {
    try {
        const result = await liveClassService.getLiveClassesByStudent(req.user.id);
        res.json({ status: true, data: result });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await liveClassService.updateLiveClassStatus(id, req.user.id, status);
        res.json({ status: true, msg: "Status updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
}

async function deleteLiveClass(req, res) {
    try {
        const { id } = req.params;
        const result = await liveClassService.deleteLiveClass(id, req.user.id);
        res.json({ status: true, msg: "Live class deleted successfully", data: result });
    } catch (err) {
        res.status(500).json({ status: false, msg: err.message });
    }
}

module.exports = {
    createLiveClass,
    getTeacherLiveClasses,
    getStudentLiveClasses,
    updateStatus,
    deleteLiveClass
};
