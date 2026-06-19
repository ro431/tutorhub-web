const scheduleService = require("../services/schedule.service");

/* ===============================
   CREATE COURSE SCHEDULE
================================ */
async function createCourseSchedule(req, res) {
  return scheduleService
    .createCourseSchedule(req.body)
    .then(result =>
      res.status(201).json({
        status: true,
        msg: "Schedule created successfully",
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
   GET SCHEDULE BY ID
================================ */
async function getScheduleById(req, res) {
  return scheduleService
    .getScheduleById(req.params.id)
    .then(result =>
      result.length
        ? res.status(200).json({
            status: true,
            msg: "Schedule fetched successfully",
            data: result
          })
        : res.status(404).json({
            status: false,
            msg: "Schedule not found"
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
   GET ALL SCHEDULES
================================ */
async function getAllSchedules(req, res) {
  return scheduleService
    .getAllSchedules()
    .then(result =>
      res.json({
        status: true,
        msg: "Schedules fetched successfully",
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
   GET SCHEDULES BY COURSE ID
================================ */
async function getSchedulesByCourseId(req, res) {
  return scheduleService
    .getSchedulesByCourseId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Schedules fetched successfully",
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
   GET SCHEDULES BY TEACHER ID
================================ */
async function getSchedulesByTeacherId(req, res) {
  return scheduleService
    .getSchedulesByTeacherId(req.params.id)
    .then(result =>
      res.json({
        status: true,
        msg: "Schedules fetched successfully",
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
   GET SCHEDULES BY DAY
================================ */
async function getSchedulesByDay(req, res) {
  return scheduleService
    .getSchedulesByDay(req.params.day)
    .then(result =>
      res.json({
        status: true,
        msg: "Schedules fetched successfully",
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
   UPDATE SCHEDULE
================================ */
async function updateSchedule(req, res) {
  return scheduleService
    .updateSchedule(req.params.id, req.body)
    .then(result =>
      res.json({
        status: true,
        msg: "Schedule updated successfully",
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
   DELETE SCHEDULE
================================ */
async function deleteSchedule(req, res) {
  return scheduleService
    .deleteSchedule(req.params.id)
    .then(result =>
      result.affectedRows
        ? res.status(200).json({
            status: true,
            msg: "Schedule deleted successfully",
            data: result
          })
        : res.status(404).json({
            status: false,
            msg: "Schedule not found"
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
  createCourseSchedule,
  getScheduleById,
  getAllSchedules,
  getSchedulesByCourseId,
  getSchedulesByTeacherId,
  getSchedulesByDay,
  updateSchedule,
  deleteSchedule
};
