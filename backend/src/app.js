const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");
const courseRoutes = require("./routes/course.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const requestRoutes = require("./routes/request.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const chatRoutes = require("./routes/chat.routes");
const liveClassRoutes = require("./routes/live-class.routes");

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/live-classes", liveClassRoutes);

app.get("/", (req, res) => {
  res.send("TutorHub API is running");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
