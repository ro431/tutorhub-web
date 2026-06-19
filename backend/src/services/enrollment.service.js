const db = require("../config/db");

// CREATE ENROLLMENT
async function createEnrollment(enrollment) {
  const { student_id, course_id } = enrollment;

  const [result] = await db.query(
    "INSERT INTO course_enrollments (student_id, course_id) VALUES (?, ?)",
    [student_id, course_id]
  );
  return result;
}

// GET ENROLLMENT BY ID
async function getEnrollmentById(enrollmentId) {
  const [result] = await db.query(
    `SELECT ce.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_enrollments ce 
     JOIN users s ON ce.student_id = s.id 
     JOIN courses c ON ce.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE ce.id = ?`,
    [enrollmentId]
  );
  return result;
}

// GET ALL ENROLLMENTS
async function getAllEnrollments() {
  const [result] = await db.query(
    `SELECT ce.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_enrollments ce 
     JOIN users s ON ce.student_id = s.id 
     JOIN courses c ON ce.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id`
  );
  return result;
}

// GET ENROLLMENTS BY STUDENT ID
async function getEnrollmentsByStudentId(studentId) {
  const [result] = await db.query(
    `SELECT ce.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_enrollments ce 
     JOIN users s ON ce.student_id = s.id 
     JOIN courses c ON ce.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE ce.student_id = ?`,
    [studentId]
  );
  return result;
}

// GET ENROLLMENTS BY TEACHER ID
async function getEnrollmentsByTeacherId(teacherId) {
  const [result] = await db.query(
    `SELECT ce.*, s.name as student_name, s.email as student_email, s.last_seen,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_enrollments ce 
     JOIN users s ON ce.student_id = s.id 
     JOIN courses c ON ce.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE c.teacher_id = ? AND ce.status = 'approved'`,
    [teacherId]
  );
  return result;
}

// GET ENROLLMENTS BY COURSE ID
async function getEnrollmentsByCourseId(courseId) {
  const [result] = await db.query(
    `SELECT ce.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_enrollments ce 
     JOIN users s ON ce.student_id = s.id 
     JOIN courses c ON ce.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE ce.course_id = ?`,
    [courseId]
  );
  return result;
}

// REMOVE ENROLLMENT (Leave Course)
async function removeEnrollment(courseId, studentId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Delete from course_enrollments
    await connection.query(
      "DELETE FROM course_enrollments WHERE course_id = ? AND student_id = ?",
      [courseId, studentId]
    );

    // 2. Delete from course_requests (so they can re-enroll)
    await connection.query(
      "DELETE FROM course_requests WHERE course_id = ? AND student_id = ?",
      [courseId, studentId]
    );

    await connection.commit();
    return { status: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// CHECK IF ENROLLMENT ALREADY EXISTS
async function checkExistingEnrollment(studentId, courseId) {
  const [result] = await db.query(
    "SELECT id FROM course_enrollments WHERE student_id = ? AND course_id = ?",
    [studentId, courseId]
  );
  return result;
}

// GET ENROLLMENT COUNT BY COURSE
async function getEnrollmentCountByCourse(courseId) {
  const [result] = await db.query(
    "SELECT COUNT(*) as count FROM course_enrollments WHERE course_id = ?",
    [courseId]
  );
  return result;
}

// GET PENDING ENROLLMENTS BY TEACHER
async function getPendingEnrollments(teacherId) {
  const [result] = await db.query(
    `SELECT cr.id, cr.student_id, cr.course_id, cr.request_date,
            s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.name as course_name, c.price as fee, c.price as course_price,
            t.name as teacher_name, t.email as teacher_email, t.id as teacher_id
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE c.teacher_id = ? AND cr.status = 'pending'`,
    [teacherId]
  );
  return result;
}

// APPROVE ENROLLMENT REQUEST
async function approveEnrollment(requestId, enrollmentData) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Update enrollment request status
    await connection.query(
      "UPDATE course_requests SET status = 'approved' WHERE id = ?",
      [requestId]
    );

    // Create actual enrollment
    const [result] = await connection.query(
      "INSERT INTO course_enrollments (student_id, course_id, teacher_id, status, enrollment_date) VALUES (?, ?, ?, 'approved', ?)",
      [enrollmentData.student_id, enrollmentData.course_id, enrollmentData.teacher_id, enrollmentData.enrollment_date]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// REJECT ENROLLMENT REQUEST
async function rejectEnrollment(requestId) {
  const [result] = await db.query(
    "UPDATE course_requests SET status = 'rejected' WHERE id = ?",
    [requestId]
  );
  return result;
}

module.exports = {
  createEnrollment,
  getEnrollmentById,
  getAllEnrollments,
  getEnrollmentsByStudentId,
  getEnrollmentsByTeacherId,
  getEnrollmentsByCourseId,
  removeEnrollment,
  checkExistingEnrollment,
  getEnrollmentCountByCourse,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment
};
