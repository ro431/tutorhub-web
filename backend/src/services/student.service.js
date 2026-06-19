const db = require("../config/db");

/* =====================================================
   STUDENT PROFILE
===================================================== */

// CREATE STUDENT PROFILE
async function createStudentProfile(profile) {
  const { user_id, grade_level, subjects_of_interest, learning_goals } = profile;

  const [result] = await db.query(
    `INSERT INTO student_profiles 
     (user_id, grade_level, subjects_of_interest, learning_goals)
     VALUES (?, ?, ?, ?)`,
    [user_id, grade_level, subjects_of_interest, learning_goals]
  );
  return result;
}

// GET PROFILE BY USER ID
async function getStudentProfileByUserId(userId) {
  const [result] = await db.query(
    `SELECT u.id as user_id, u.name, u.email, u.phone, u.profile, 
            sp.grade_level, sp.subjects_of_interest, sp.learning_goals
     FROM users u
     LEFT JOIN student_profiles sp ON u.id = sp.user_id
     WHERE u.id = ?`,
    [userId]
  );
  return result;
}

// UPDATE PROFILE
async function updateStudentProfile(userId, data) {
  const { name, phone, profile, grade_level, subjects_of_interest, learning_goals } = data;

  // 1. Update users table (name, phone, profile/image)
  if (name || phone || profile) {
    let userQuery = "UPDATE users SET ";
    let userParams = [];
    if (name) { userQuery += "name=?, "; userParams.push(name); }
    if (phone) { userQuery += "phone=?, "; userParams.push(phone); }
    if (profile) { userQuery += "profile=?, "; userParams.push(profile); }

    // Remove trailing comma and space
    userQuery = userQuery.slice(0, -2);
    userQuery += " WHERE id=?";
    userParams.push(userId);

    await db.query(userQuery, userParams);
  }

  // 2. Update student_profiles table (grade_level, etc.)
  if (grade_level || subjects_of_interest || learning_goals) {
    await db.query(
      `INSERT INTO student_profiles (user_id, grade_level, subjects_of_interest, learning_goals)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       grade_level = VALUES(grade_level),
       subjects_of_interest = VALUES(subjects_of_interest),
       learning_goals = VALUES(learning_goals)`,
      [userId, grade_level || null, subjects_of_interest || null, learning_goals || null]
    );
  }

  return { status: true };
}

// DELETE PROFILE
async function deleteStudentProfile(userId) {
  const [result] = await db.query(
    "DELETE FROM student_profiles WHERE user_id=?",
    [userId]
  );
  return result;
}

/* =====================================================
   COURSES
===================================================== */

// GET AVAILABLE COURSES with student's enrollment status
async function getAvailableCourses(studentId) {
  const [result] = await db.query(
    `SELECT c.*, c.price as fee, 
            (SELECT cr.status FROM course_requests cr 
             WHERE cr.course_id = c.id AND cr.student_id = ? 
             ORDER BY cr.request_date DESC LIMIT 1) as enrollment_status,
            u.name as teacher_name, u.profile as teacher_profile
     FROM courses c
     JOIN users u ON c.teacher_id = u.id`,
    [studentId]
  );
  return result;
}

/* =====================================================
   ENROLLMENTS
===================================================== */

// GET STUDENT ENROLLMENTS
async function getStudentEnrollments(studentId) {
  const [result] = await db.query(
    `SELECT cr.id as request_id, cr.status, cr.request_date,
            c.id as course_id, c.subject, c.description, c.price as fee, c.mode,
            c.start_date, c.end_date,
            u.name AS teacher_name, u.profile as teacher_profile
     FROM course_requests cr
     JOIN courses c ON cr.course_id = c.id
     JOIN users u ON c.teacher_id = u.id
     WHERE cr.student_id = ?
     ORDER BY cr.request_date DESC`,
    [studentId]
  );
  return result;
}

// GET STUDENT TEACHERS (Unique teachers from enrollments)
async function getStudentTeachers(studentId) {
  const [result] = await db.query(
    `SELECT DISTINCT u.id, u.name, u.email, u.phone, u.profile, u.last_seen
     FROM users u
     JOIN courses c ON u.id = c.teacher_id
     JOIN course_enrollments ce ON c.id = ce.course_id
     WHERE ce.student_id = ? AND ce.status = 'approved'`,
    [studentId]
  );
  return result;
}

// LEAVE / CANCEL ENROLLMENT
async function leaveCourse(enrollmentId, studentId) {
  const [result] = await db.query(
    `DELETE FROM course_enrollments 
     WHERE id = ? AND student_id = ?`,
    [enrollmentId, studentId]
  );
  return result;
}

/* =====================================================
   COURSE REQUESTS
===================================================== */

// GET STUDENT COURSE REQUESTS
async function getStudentCourseRequests(studentId) {
  const [result] = await db.query(
    `SELECT cr.*, c.subject as course_name, c.description, c.price as fee, c.mode,
            u.name AS teacher_name, u.profile as teacher_profile
     FROM course_requests cr
     JOIN courses c ON cr.course_id = c.id
     JOIN users u ON c.teacher_id = u.id
     WHERE cr.student_id = ?
     ORDER BY cr.request_date DESC`,
    [studentId]
  );
  return result;
}

// SEND COURSE REQUEST
async function sendCourseRequest(studentId, courseId) {
  const [result] = await db.query(
    `INSERT INTO course_requests (student_id, course_id, status)
     VALUES (?, ?, 'pending')`,
    [studentId, courseId]
  );
  return result;
}

// CANCEL COURSE REQUEST
async function cancelCourseRequest(requestId, studentId) {
  const [result] = await db.query(
    `DELETE FROM course_requests 
     WHERE id = ? AND student_id = ?`,
    [requestId, studentId]
  );
  return result;
}

/* =====================================================
   MODULE EXPORTS
===================================================== */

module.exports = {
  // courses
  getAvailableCourses,

  // profile
  createStudentProfile,
  getStudentProfileByUserId,
  updateStudentProfile,
  deleteStudentProfile,

  // enrollments
  getStudentEnrollments,
  getStudentTeachers,
  leaveCourse,

  // requests
  getStudentCourseRequests,
  sendCourseRequest,
  cancelCourseRequest
};
