const requestService = require("../services/request.service");

/* ===============================
   CREATE COURSE REQUEST
================================ */
async function createCourseRequest(req, res) {
  const request = req.body;

  return requestService
    .checkExistingRequest(request.student_id, request.course_id)
    .then(existing =>
      existing.length
        ? res.status(400).json({
            status: false,
            msg: "Request already exists for this course"
          })
        : requestService.createCourseRequest(request).then(result =>
            res.status(201).json({
              status: true,
              msg: "Course request created successfully",
              data: result
            })
          )
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   GET REQUEST BY ID
================================ */
async function getRequestById(req, res) {
  return requestService
    .getRequestById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
            status: true,
            msg: "Request fetched successfully",
            data: result
          })
        : res.status(404).json({
            status: false,
            msg: "Request not found"
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
   GET ALL REQUESTS
================================ */
async function getAllRequests(req, res) {
  return requestService
    .getAllRequests()
    .then(result =>
      res.json({
        status: true,
        msg: "Requests fetched successfully",
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
   GET REQUESTS BY STUDENT ID
================================ */
async function getRequestsByStudentId(req, res) {
  return requestService
    .getRequestsByStudentId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Student requests fetched successfully",
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
   GET REQUESTS BY TEACHER ID
================================ */
async function getRequestsByTeacherId(req, res) {
  return requestService
    .getRequestsByTeacherId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Teacher requests fetched successfully",
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
   GET REQUESTS BY COURSE ID
================================ */
async function getRequestsByCourseId(req, res) {
  return requestService
    .getRequestsByCourseId(req.params.id)
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

/* ===============================
   GET REQUESTS BY STATUS
================================ */
async function getRequestsByStatus(req, res) {
  return requestService
    .getRequestsByStatus(req.params.status)
    .then(result =>
      res.json({
        status: true,
        msg: "Requests fetched successfully",
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
   APPROVE REQUEST
================================ */
async function approveRequest(req, res) {
  return requestService
    .updateRequestStatus(req.params.id, "approved")
    .then(result =>
      res.json({
        status: true,
        msg: "Request approved successfully",
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
   REJECT REQUEST
================================ */
async function rejectRequest(req, res) {
  return requestService
    .updateRequestStatus(req.params.id, "rejected")
    .then(result =>
      res.json({
        status: true,
        msg: "Request rejected successfully",
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
   DELETE REQUEST
================================ */
async function deleteRequest(req, res) {
  return requestService
    .deleteRequest(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
            status: true,
            msg: "Request deleted successfully",
            data: result
          })
        : res.status(404).json({
            status: false,
            msg: "Request not found"
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
  createCourseRequest,
  getRequestById,
  getAllRequests,
  getRequestsByStudentId,
  getRequestsByTeacherId,
  getRequestsByCourseId,
  getRequestsByStatus,
  approveRequest,
  rejectRequest,
  deleteRequest
};
