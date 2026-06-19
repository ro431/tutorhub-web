const courseService = require("../services/course.service");
const enrollmentService = require("../services/enrollment.service");
const requestService = require("../services/request.service");
const studentService = require("../services/student.service");

/* ===============================
   COURSES
================================ */
async function getAvailableCourses(req, res) {
  return studentService
    .getAvailableCourses(req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Courses fetched successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   STUDENT PROFILE
================================ */
async function createStudentProfile(req, res) {
  const profile = { ...req.body, user_id: req.user.id };

  return studentService
    .createStudentProfile(profile)
    .then(result =>
      res.status(201).json({
        status: true,
        msg: "Student profile created successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function getStudentProfileByUserId(req, res) {
  return studentService
    .getStudentProfileByUserId(req.user.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Student profile fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Student profile not found"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function updateStudentProfile(req, res) {
  return studentService
    .updateStudentProfile(req.user.id, req.body)
    .then(result =>
      res.json({
        status: true,
        msg: "Student profile updated successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function deleteStudentProfile(req, res) {
  return studentService
    .deleteStudentProfile(req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Student profile deleted successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   ENROLLMENTS
================================ */
async function getStudentEnrollments(req, res) {
  return studentService
    .getStudentEnrollments(req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Enrollments fetched successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function getStudentTeachers(req, res) {
  return studentService
    .getStudentTeachers(req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Teachers fetched successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function leaveCourse(req, res) {
  return enrollmentService
    .removeEnrollment(req.params.id, req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Enrollment cancelled successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   COURSE REQUESTS
================================ */
async function getStudentCourseRequests(req, res) {
  return studentService
    .getStudentCourseRequests(req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Course requests fetched successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function sendCourseRequest(req, res) {
  return requestService
    .createCourseRequest({
      student_id: req.user.id,
      course_id: req.body.course_id
    })
    .then(result =>
      res.status(201).json({
        status: true,
        msg: "Course request sent successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

async function cancelCourseRequest(req, res) {
  return studentService
    .cancelCourseRequest(req.params.id, req.user.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Course request cancelled successfully",
        data: result
      })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   MODULE EXPORTS
================================ */
module.exports = {
  getAvailableCourses,

  createStudentProfile,
  getStudentProfileByUserId,
  updateStudentProfile,
  deleteStudentProfile,

  getStudentEnrollments,
  getStudentTeachers,
  leaveCourse,

  getStudentCourseRequests,
  sendCourseRequest,
  cancelCourseRequest
};
