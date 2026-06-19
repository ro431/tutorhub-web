const teacherService = require("../services/teacher.service");

/* ===============================
   CREATE TEACHER PROFILE
================================ */
async function createTeacherProfile(req, res) {
  const profile = req.body;

  return !profile
    ? res.status(400).json({
      status: false,
      msg: "Profile data is required"
    })
    : teacherService.createTeacherProfile(profile)
      .then(result =>
        res.status(201).json({
          status: true,
          msg: "Teacher profile created successfully",
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
   GET TEACHER PROFILE BY USER ID
================================ */
async function getTeacherProfileByUserId(req, res) {
  return teacherService
    .getTeacherProfileByUserId(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Teacher profile fetched successfully",
          data: result
        })
        : (console.log(`Profile not found for User ID: ${req.params.id}`), res.status(404).json({
          status: false,
          msg: "Teacher profile not found"
        }))
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

/* ===============================
   GET TEACHER PROFILE BY PROFILE ID
================================ */
async function getTeacherProfileById(req, res) {
  return teacherService
    .getTeacherProfileById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Teacher profile fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Teacher profile not found"
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
   GET ALL TEACHER PROFILES
================================ */
async function getAllTeacherProfiles(req, res) {
  return teacherService
    .getAllTeacherProfiles()
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Teacher profiles fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "No teacher profiles found"
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
   UPDATE TEACHER PROFILE
================================ */
async function updateTeacherProfile(req, res) {
  return teacherService
    .updateTeacherProfile(req.params.id, req.body)
    .then(result =>
      res.json({
        status: true,
        msg: "Teacher profile updated successfully",
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
   DELETE TEACHER PROFILE
================================ */
async function deleteTeacherProfile(req, res) {
  return teacherService
    .deleteTeacherProfile(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
          status: true,
          msg: "Teacher profile deleted successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Teacher profile not found"
        })
    )
    .catch(err =>
      res.status(500).json({
        status: false,
        msg: err.message
      })
    );
}

module.exports = {
  createTeacherProfile,
  getTeacherProfileByUserId,
  getTeacherProfileById,
  getAllTeacherProfiles,
  updateTeacherProfile,
  deleteTeacherProfile
};
