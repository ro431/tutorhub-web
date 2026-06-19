const notificationService = require("../services/notification.service");

async function getTeacherNotifications(req, res) {
    const teacherId = req.user.id;

    try {
        const notifications = await notificationService.getTeacherNotifications(teacherId);
        res.status(200).json({
            status: true,
            msg: "Notifications fetched successfully",
            data: notifications
        });
    } catch (err) {
        console.error("Error in getTeacherNotifications:", err);
        res.status(500).json({
            status: false,
            msg: err.message
        });
    }
}

module.exports = {
    getTeacherNotifications
};
