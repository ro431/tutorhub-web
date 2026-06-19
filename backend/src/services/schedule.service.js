const db = require("../config/db");

// CREATE COURSE SCHEDULE
async function createCourseSchedule(schedule) {
  const { course_id, day, start_time, end_time } = schedule;

  const [result] = await db.query(
    "INSERT INTO course_schedules (course_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
    [course_id, day, start_time, end_time]
  );
  return result;
}

// GET SCHEDULE BY ID
async function getScheduleById(scheduleId) {
  const [result] = await db.query(
    "SELECT cs.*, c.subject as course_subject, c.teacher_id FROM course_schedules cs JOIN courses c ON cs.course_id = c.id WHERE cs.id = ?",
    [scheduleId]
  );
  return result;
}

// GET ALL SCHEDULES
async function getAllSchedules() {
  const [result] = await db.query(
    "SELECT cs.*, c.subject as course_subject, c.teacher_id, u.name as teacher_name FROM course_schedules cs JOIN courses c ON cs.course_id = c.id JOIN users u ON c.teacher_id = u.id"
  );
  return result;
}

// GET SCHEDULES BY COURSE ID
async function getSchedulesByCourseId(courseId) {
  const [result] = await db.query(
    "SELECT cs.*, c.subject as course_subject, c.teacher_id, u.name as teacher_name FROM course_schedules cs JOIN courses c ON cs.course_id = c.id JOIN users u ON c.teacher_id = u.id WHERE cs.course_id = ?",
    [courseId]
  );
  return result;
}

// GET SCHEDULES BY TEACHER ID
async function getSchedulesByTeacherId(teacherId) {
  const [result] = await db.query(
    "SELECT cs.*, c.subject as course_subject, c.teacher_id, u.name as teacher_name FROM course_schedules cs JOIN courses c ON cs.course_id = c.id JOIN users u ON c.teacher_id = u.id WHERE c.teacher_id = ?",
    [teacherId]
  );
  return result;
}

// UPDATE SCHEDULE
async function updateSchedule(scheduleId, schedule) {
  const { day, start_time, end_time } = schedule;

  const [result] = await db.query(
    "UPDATE course_schedules SET day=?, start_time=?, end_time=? WHERE id=?",
    [day, start_time, end_time, scheduleId]
  );
  return result;
}

// DELETE SCHEDULE
async function deleteSchedule(scheduleId) {
  const [result] = await db.query(
    "DELETE FROM course_schedules WHERE id = ?",
    [scheduleId]
  );
  return result;
}

// DELETE SCHEDULES BY COURSE ID
async function deleteSchedulesByCourseId(courseId) {
  const [result] = await db.query(
    "DELETE FROM course_schedules WHERE course_id = ?",
    [courseId]
  );
  return result;
}

// GET SCHEDULES BY DAY
async function getSchedulesByDay(day) {
  const [result] = await db.query(
    "SELECT cs.*, c.subject as course_subject, c.teacher_id, u.name as teacher_name FROM course_schedules cs JOIN courses c ON cs.course_id = c.id JOIN users u ON c.teacher_id = u.id WHERE cs.day = ?",
    [day]
  );
  return result;
}

module.exports = {
  createCourseSchedule,
  getScheduleById,
  getAllSchedules,
  getSchedulesByCourseId,
  getSchedulesByTeacherId,
  updateSchedule,
  deleteSchedule,
  deleteSchedulesByCourseId,
  getSchedulesByDay
};
