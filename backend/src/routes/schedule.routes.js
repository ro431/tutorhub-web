const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const auth = require("../middleware/auth.middleware");

// SCHEDULE APIs
router.post("/", auth, scheduleController.createCourseSchedule);
router.get("/", scheduleController.getAllSchedules);
router.get("/:id", scheduleController.getScheduleById);
router.get("/course/:id", scheduleController.getSchedulesByCourseId);
router.get("/teacher/:id", scheduleController.getSchedulesByTeacherId);
router.get("/day/:day", scheduleController.getSchedulesByDay);
router.put("/:id", auth, scheduleController.updateSchedule);
router.delete("/:id", auth, scheduleController.deleteSchedule);

module.exports = router;

