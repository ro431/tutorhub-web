const db = require("../config/db");

// CREATE COURSE REQUEST
async function createCourseRequest(request) {
  const { student_id, course_id } = request;

  // 1. Check if already exists (pending or approved)
  const [existing] = await db.query(
    "SELECT id FROM course_requests WHERE student_id = ? AND course_id = ? AND status IN ('pending', 'approved')",
    [student_id, course_id]
  );

  if (existing.length > 0) {
    throw new Error("You already have a pending or active enrollment for this course");
  }

  // 2. Create new request
  const [result] = await db.query(
    "INSERT INTO course_requests (student_id, course_id) VALUES (?, ?)",
    [student_id, course_id]
  );
  return result;
}

// GET REQUEST BY ID
async function getRequestById(requestId) {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE cr.id = ?`,
    [requestId]
  );
  return result;
}

// GET ALL REQUESTS
async function getAllRequests() {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id`
  );
  return result;
}

// GET REQUESTS BY STUDENT ID
async function getRequestsByStudentId(studentId) {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE cr.student_id = ?`,
    [studentId]
  );
  return result;
}

// GET REQUESTS BY TEACHER ID
async function getRequestsByTeacherId(teacherId) {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE c.teacher_id = ?`,
    [teacherId]
  );
  return result;
}

// GET REQUESTS BY COURSE ID
async function getRequestsByCourseId(courseId) {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE cr.course_id = ?`,
    [courseId]
  );
  return result;
}

// GET REQUESTS BY STATUS
async function getRequestsByStatus(status) {
  const [result] = await db.query(
    `SELECT cr.*, s.name as student_name, s.email as student_email,
            c.subject as course_subject, c.teacher_id,
            t.name as teacher_name, t.email as teacher_email
     FROM course_requests cr 
     JOIN users s ON cr.student_id = s.id 
     JOIN courses c ON cr.course_id = c.id 
     JOIN users t ON c.teacher_id = t.id 
     WHERE cr.status = ?`,
    [status]
  );
  return result;
}

// UPDATE REQUEST STATUS
async function updateRequestStatus(requestId, status) {
  const [result] = await db.query(
    "UPDATE course_requests SET status=? WHERE id=?",
    [status, requestId]
  );
  return result;
}

// DELETE REQUEST
async function deleteRequest(requestId) {
  const [result] = await db.query(
    "DELETE FROM course_requests WHERE id = ?",
    [requestId]
  );
  return result;
}

// CHECK IF REQUEST ALREADY EXISTS
async function checkExistingRequest(studentId, courseId) {
  const [result] = await db.query(
    "SELECT id FROM course_requests WHERE student_id = ? AND course_id = ? AND status IN ('pending', 'approved')",
    [studentId, courseId]
  );
  return result;
}

module.exports = {
  createCourseRequest,
  getRequestById,
  getAllRequests,
  getRequestsByStudentId,
  getRequestsByTeacherId,
  getRequestsByCourseId,
  getRequestsByStatus,
  updateRequestStatus,
  deleteRequest,
  checkExistingRequest
};
