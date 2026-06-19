const courseService = require("../services/course.service");

/* ===============================
   CREATE COURSE
================================ */
async function createCourse(req, res) {
  const course = {
    ...req.body,
    teacher_id: req.user.id   // ✅ JWT se aa raha hai
  };

  return courseService
    .createCourse(course)
    .then(result =>
      res.status(201).json({
        status: true,
        msg: "Course created successfully",
        data: result
      })
    )
    .catch(err => {
      console.error("Error in createCourse:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}


/* ===============================
   GET COURSE BY ID
================================ */
async function getCourseById(req, res) {
  return courseService
    .getCourseById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Course fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Course not found"
        })
    )
    .catch(err => {
      console.error("Error in getCourseById:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}

/* ===============================
   GET ALL COURSES
================================ */
async function getAllCourses(req, res) {
  return courseService
    .getAllCourses()
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
   GET COURSES BY TEACHER ID
================================ */
async function getCoursesByTeacherId(req, res) {
  return courseService
    .getCoursesByTeacherId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Teacher courses fetched successfully",
        data: result
      })
    )
    .catch(err => {
      console.error("Error in getCoursesByTeacherId:", err);
      res.status(500).json({
        status: false,
        msg: err.message
      });
    });
}

/* ===============================
   UPDATE COURSE
================================ */
async function updateCourse(req, res) {
  return courseService
    .updateCourse(req.params.id, req.body)
    .then(result =>
      res.json({
        status: true,
        msg: "Course updated successfully",
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
   DELETE COURSE
================================ */
async function deleteCourse(req, res) {
  return courseService
    .deleteCourse(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
          status: true,
          msg: "Course deleted successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Course not found"
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
   GET COURSES WITH SCHEDULES
================================ */
async function getCoursesWithSchedules(req, res) {
  return courseService
    .getCoursesWithSchedules()
    .then(result =>
      res.json({
        status: true,
        msg: "Courses with schedules fetched successfully",
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
   GET COURSE WITH SCHEDULES BY ID
================================ */
async function getCourseWithSchedulesById(req, res) {
  return courseService
    .getCourseWithSchedulesById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
          status: true,
          msg: "Course with schedules fetched successfully",
          data: result
        })
        : res.status(404).json({
          status: false,
          msg: "Course not found"
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
  createCourse,
  getCourseById,
  getAllCourses,
  getCoursesByTeacherId,
  updateCourse,
  deleteCourse,
  getCoursesWithSchedules,
  getCourseWithSchedulesById
};
