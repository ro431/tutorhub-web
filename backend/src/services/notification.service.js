const db = require("../config/db");

// GET NOTIFICATIONS FOR TEACHER
async function getTeacherNotifications(teacherId) {
    const [rows] = await db.query(
        `SELECT er.id, er.student_id, er.course_id, er.status, er.request_date,
            s.name as student_name, c.name as course_name
     FROM enrollment_requests er
     JOIN users s ON er.student_id = s.id
     JOIN courses c ON er.course_id = c.id
     WHERE c.teacher_id = ?
     ORDER BY er.request_date DESC
     LIMIT 10`,
        [teacherId]
    );
    return rows;
}

module.exports = {
    getTeacherNotifications
};
