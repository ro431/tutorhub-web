const db = require("../config/db");

// GET ADMIN DASHBOARD STATS
async function getStats() {
    const [teachers] = await db.query("SELECT COUNT(*) as count FROM users WHERE role='teacher'");
    const [students] = await db.query("SELECT COUNT(*) as count FROM users WHERE role='student'");
    const [courses] = await db.query("SELECT COUNT(*) as count FROM courses");
    const [enrollments] = await db.query("SELECT COUNT(*) as count FROM course_enrollments");

    return {
        totalTeachers: teachers[0].count,
        totalStudents: students[0].count,
        totalCourses: courses[0].count,
        totalEnrollments: enrollments[0].count
    };
}

// GET ALL TEACHERS
async function getAllTeachers() {
    const [rows] = await db.query(
        "SELECT id, name, email, phone, profile, created_at FROM users WHERE role='teacher' ORDER BY created_at DESC"
    );
    return rows;
}

// GET ALL STUDENTS
async function getAllStudents() {
    const [rows] = await db.query(
        "SELECT id, name, email, phone, profile, created_at FROM users WHERE role='student' ORDER BY created_at DESC"
    );
    return rows;
}

// GET ALL COURSES
async function getAllCourses() {
    const [rows] = await db.query(
        `SELECT c.*, u.name as teacher_name 
     FROM courses c 
     JOIN users u ON c.teacher_id = u.id 
     ORDER BY c.created_at DESC`
    );
    return rows;
}

// GET STUDENT-TEACHER MAPPING (Enrollments)
async function getEnrollmentMapping() {
    const [rows] = await db.query(
        `SELECT 
      ce.id as enrollment_id,
      s.name as student_name,
      s.email as student_email,
      s.profile as student_profile,
      t.name as teacher_name,
      t.email as teacher_email,
      t.profile as teacher_profile,
      c.name as course_name,
      ce.enrollment_date,
      ce.status
    FROM course_enrollments ce
    JOIN users s ON ce.student_id = s.id
    JOIN courses c ON ce.course_id = c.id
    JOIN users t ON c.teacher_id = t.id
    ORDER BY ce.enrollment_date DESC`
    );
    return rows;
}

// UPDATE ADMIN PROFILE
async function updateProfile(adminId, data) {
    const { email, password } = data;
    let query = "UPDATE users SET email = ?";
    let params = [email];

    if (password) {
        // Note: Assuming bcrypt is used elsewhere, but user.service.js showed plain text password comparison?
        // Let me check user.service.js again.
        // Line 7: "SELECT * FROM users WHERE password=? AND (email=? OR phone=?)"
        // It seems the current implementation uses plain text passwords! (Which is bad, but I should stick to the existing pattern or fix it if I can)
        // Actually, line 7 in user.service.js uses `password=?`. 
        // If I use bcrypt here, login will fail for the admin.
        // I will stick to the existing pattern for now (plain text) unless I see bcrypt used in signup.

        query += ", password = ?";
        params.push(password);
    }

    query += " WHERE id = ? AND role = 'admin'";
    params.push(adminId);

    const [result] = await db.query(query, params);
    return result;
}

// DELETE USER AND RELATED DATA
async function deleteUser(userId) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get user role to know what to cleanup
        const [users] = await connection.query("SELECT role FROM users WHERE id = ?", [userId]);
        if (users.length === 0) throw new Error("User not found");
        const role = users[0].role;

        if (role === 'teacher') {
            // Cleanup for Teacher
            // - Delete enrollment requests for teacher's courses
            await connection.query("DELETE FROM enrollment_requests WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = ?)", [userId]);
            // - Delete enrollments for teacher's courses
            await connection.query("DELETE FROM course_enrollments WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = ?)", [userId]);
            // - Delete live classes
            await connection.query("DELETE FROM live_classes WHERE teacher_id = ?", [userId]);
            // - Delete teacher profile
            await connection.query("DELETE FROM teacher_profiles WHERE user_id = ?", [userId]);
            // - Delete courses
            await connection.query("DELETE FROM courses WHERE teacher_id = ?", [userId]);
        } else if (role === 'student') {
            // Cleanup for Student
            // - Delete enrollment requests by student
            await connection.query("DELETE FROM enrollment_requests WHERE student_id = ?", [userId]);
            // - Delete enrollments for student
            await connection.query("DELETE FROM course_enrollments WHERE student_id = ?", [userId]);
        }

        // 2. Finally delete the user
        const [result] = await connection.query("DELETE FROM users WHERE id = ?", [userId]);

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
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
