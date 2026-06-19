const db = require("../config/db");

// CREATE COURSE
async function createCourse(course) {
  const { teacher_id, subject, description, content, fee, mode, start_date, end_date } = course;

  // DB column names are actually 'name' (for subject) and 'price' (for fee)
  // based on the view definitions and general naming consistency in TutorHub
  const courseName = subject;
  const coursePrice = fee;

  try {
    const [result] = await db.query(
      "INSERT INTO courses (teacher_id, name, subject, description, content, price, mode, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [teacher_id, courseName, subject, description, content, coursePrice, mode, start_date, end_date]
    );
    return result;
  } catch (error) {
    console.error("Database Error in createCourse:", error);
    throw error;
  }
}

// GET COURSE BY ID
async function getCourseById(courseId) {
  try {
    const [result] = await db.query(
      "SELECT c.*, c.price as fee, u.name as teacher_name, u.email as teacher_email, u.profile as teacher_profile FROM courses c JOIN users u ON c.teacher_id = u.id WHERE c.id = ?",
      [courseId]
    );
    return result;
  } catch (error) {
    console.error("Database Error in getCourseById:", error);
    throw error;
  }
}

// GET ALL COURSES
async function getAllCourses() {
  try {
    const [result] = await db.query(
      "SELECT c.*, c.price as fee, u.name as teacher_name, u.email as teacher_email, u.profile as teacher_profile FROM courses c JOIN users u ON c.teacher_id = u.id"
    );
    return result;
  } catch (error) {
    console.error("Database Error in getAllCourses:", error);
    throw error;
  }
}

// GET COURSES BY TEACHER ID
async function getCoursesByTeacherId(teacherId) {
  try {
    const [result] = await db.query(
      "SELECT c.*, c.price as fee, u.name as teacher_name, u.email as teacher_email, u.profile as teacher_profile FROM courses c JOIN users u ON c.teacher_id = u.id WHERE c.teacher_id = ?",
      [teacherId]
    );
    return result;
  } catch (error) {
    console.error("Database Error in getCoursesByTeacherId:", error);
    throw error;
  }
}

// UPDATE COURSE
async function updateCourse(courseId, course) {
  const { subject, description, content, fee, mode, start_date, end_date } = course;
  const courseName = subject;
  const coursePrice = fee;

  try {
    const [result] = await db.query(
      "UPDATE courses SET name=?, subject=?, description=?, content=?, price=?, mode=?, start_date=?, end_date=? WHERE id=?",
      [courseName, subject, description, content, coursePrice, mode, start_date, end_date, courseId]
    );
    return result;
  } catch (error) {
    console.error("Database Error in updateCourse:", error);
    throw error;
  }
}

// DELETE COURSE
async function deleteCourse(courseId) {
  try {
    const [result] = await db.query(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );
    return result;
  } catch (error) {
    console.error("Database Error in deleteCourse:", error);
    throw error;
  }
}

// GET COURSES WITH SCHEDULES
async function getCoursesWithSchedules() {
  try {
    const [result] = await db.query(
      `SELECT c.*, c.price as fee, u.name as teacher_name, u.email as teacher_email, u.profile as teacher_profile,
              GROUP_CONCAT(CONCAT(cs.day, ' ', cs.start_time, '-', cs.end_time) SEPARATOR ', ') as schedules
       FROM courses c 
       JOIN users u ON c.teacher_id = u.id 
       LEFT JOIN course_schedules cs ON c.id = cs.course_id 
       GROUP BY c.id`
    );
    return result;
  } catch (error) {
    console.error("Database Error in getCoursesWithSchedules:", error);
    throw error;
  }
}

// GET COURSE WITH SCHEDULES BY ID
async function getCourseWithSchedulesById(courseId) {
  try {
    const [result] = await db.query(
      `SELECT c.*, c.price as fee, u.name as teacher_name, u.email as teacher_email, u.profile as teacher_profile,
              GROUP_CONCAT(CONCAT(cs.day, ' ', cs.start_time, '-', cs.end_time) SEPARATOR ', ') as schedules
       FROM courses c 
       JOIN users u ON c.teacher_id = u.id 
       LEFT JOIN course_schedules cs ON c.id = cs.course_id 
       WHERE c.id = ?
       GROUP BY c.id`,
      [courseId]
    );
    return result;
  } catch (error) {
    console.error("Database Error in getCourseWithSchedulesById:", error);
    throw error;
  }
}

module.exports = {
  createCourse,
  getCourseById,
  getAllCourses,
  getCoursesByTeacherId,
  updateCourse,
  deleteCourse,
  getCoursesWithSchedules,
  getCourseWithSchedulesById
};