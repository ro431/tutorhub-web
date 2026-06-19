const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const auth = require("../middleware/auth.middleware");

// REQUEST APIs
router.post("/", auth, requestController.createCourseRequest);
router.get("/", auth, requestController.getAllRequests);
router.get("/:id", auth, requestController.getRequestById);
router.get("/student/:id", auth, requestController.getRequestsByStudentId);
router.get("/teacher/:id", auth, requestController.getRequestsByTeacherId);
router.get("/course/:id", auth, requestController.getRequestsByCourseId);
router.get("/status/:status", auth, requestController.getRequestsByStatus);
router.put("/approve/:id", auth, requestController.approveRequest);
router.put("/reject/:id", auth, requestController.rejectRequest);
router.delete("/:id", auth, requestController.deleteRequest);

module.exports = router;
