const enrollmentService = require("../services/enrollment.service");

/* ===============================
   CREATE ENROLLMENT
================================ */
async function createEnrollment(req, res) {
  const enrollment = req.body;

  return enrollmentService
    .checkExistingEnrollment(enrollment.student_id, enrollment.course_id)
    .then(existing =>
      existing.length
        ? res.status(400).json({
          status: false,
          msg: "Student is already enrolled in this course"
        })
        : enrollmentService.createEnrollment(enrollment).then(result =>
          res.status(201).json({
            status: true,
            msg: "Enrollment created successfully",
            data: result
          })
        )
    )
    .catch(err => {
      console.error("Error in createEnrollment:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}

/* ===============================
   GET ENROLLMENT BY ID
================================ */
async function getEnrollmentById(req, res) {
  return enrollmentService
    .getEnrollmentById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Enrollment fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Enrollment not found"
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
   GET ALL ENROLLMENTS
================================ */
async function getAllEnrollments(req, res) {
  return enrollmentService
    .getAllEnrollments()
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

/* ===============================
   GET ENROLLMENTS BY STUDENT ID
================================ */
async function getEnrollmentsByStudentId(req, res) {
  return enrollmentService
    .getEnrollmentsByStudentId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Student enrollments fetched successfully",
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
   GET ENROLLMENTS BY TEACHER ID
================================ */
async function getEnrollmentsByTeacherId(req, res) {
  return enrollmentService
    .getEnrollmentsByTeacherId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Teacher enrollments fetched successfully",
        data: result
      })
    )
    .catch(err => {
      console.error("Error in getEnrollmentsByTeacherId:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}

/* ===============================
   GET ENROLLMENTS BY COURSE ID
================================ */
async function getEnrollmentsByCourseId(req, res) {
  return enrollmentService
    .getEnrollmentsByCourseId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Course enrollments fetched successfully",
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
   DELETE ENROLLMENT
================================ */
async function deleteEnrollment(req, res) {
  return enrollmentService
    .deleteEnrollment(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
          status: true,
          msg: "Enrollment deleted successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Enrollment not found"
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
   GET ENROLLMENT COUNT BY COURSE
================================ */
async function getEnrollmentCountByCourse(req, res) {
  return enrollmentService
    .getEnrollmentCountByCourse(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Enrollment count fetched successfully",
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
   GET PENDING ENROLLMENTS BY TEACHER
================================ */
async function getPendingEnrollments(req, res) {
  return enrollmentService
    .getPendingEnrollments(req.params.teacherId)
    .then(result =>
      res.json({
        status: true,
        msg: "Pending enrollments fetched successfully",
        data: result
      })
    )
    .catch(err => {
      console.error("Error in getPendingEnrollments:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}

/* ===============================
   APPROVE ENROLLMENT REQUEST
================================ */
async function approveEnrollment(req, res) {
  const { requestId } = req.params;
  const enrollmentData = req.body;

  return enrollmentService
    .approveEnrollment(requestId, enrollmentData)
    .then(result =>
      res.json({
        status: true,
        msg: "Enrollment approved successfully",
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
   REJECT ENROLLMENT REQUEST
================================ */
async function rejectEnrollment(req, res) {
  const { requestId } = req.params;

  return enrollmentService
    .rejectEnrollment(requestId)
    .then(result =>
      res.json({
        status: true,
        msg: "Enrollment rejected successfully",
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
  createEnrollment,
  getEnrollmentById,
  getAllEnrollments,
  getEnrollmentsByStudentId,
  getEnrollmentsByTeacherId,
  getEnrollmentsByCourseId,
  deleteEnrollment,
  getEnrollmentCountByCourse,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment
};
