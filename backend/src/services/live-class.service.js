const db = require("../config/db");

async function createLiveClass(data) {
    const { teacher_id, course_id, title, meeting_link, start_time } = data;
    const [result] = await db.query(
        "INSERT INTO live_classes (teacher_id, course_id, title, meeting_link, start_time) VALUES (?, ?, ?, ?, ?)",
        [teacher_id, course_id, title, meeting_link, start_time]
    );
    return result;
}

async function getLiveClassesByTeacher(teacherId) {
    const [rows] = await db.query(
        `SELECT lc.*, c.name as course_name 
         FROM live_classes lc 
         JOIN courses c ON lc.course_id = c.id 
         WHERE lc.teacher_id = ? 
         ORDER BY lc.start_time DESC`,
        [teacherId]
    );
    return rows;
}

async function getLiveClassesByStudent(studentId) {
    const [rows] = await db.query(
        `SELECT lc.*, c.name as course_name, u.name as teacher_name, u.profile as teacher_profile
         FROM live_classes lc 
         JOIN courses c ON lc.course_id = c.id 
         JOIN course_enrollments ce ON c.id = ce.course_id 
         JOIN users u ON lc.teacher_id = u.id
         WHERE ce.student_id = ? AND ce.status = 'approved'
         AND lc.status IN ('scheduled', 'ongoing')
         ORDER BY lc.start_time ASC`,
        [studentId]
    );
    return rows;
}

async function updateLiveClassStatus(id, teacherId, status) {
    const [result] = await db.query(
        "UPDATE live_classes SET status = ? WHERE id = ? AND teacher_id = ?",
        [status, id, teacherId]
    );
    return result;
}

async function deleteLiveClass(id, teacherId) {
    const [result] = await db.query(
        "DELETE FROM live_classes WHERE id = ? AND teacher_id = ?",
        [id, teacherId]
    );
    return result;
}

module.exports = {
    createLiveClass,
    getLiveClassesByTeacher,
    getLiveClassesByStudent,
    updateLiveClassStatus,
    deleteLiveClass
};
