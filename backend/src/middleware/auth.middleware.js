const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = (req, res, next) => {
  try {
    // Expect: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    // console.log("Auth Header:", authHeader);

    if (!authHeader) {
      return res.status(403).json({
        status: false,
        message: "Authorization header missing"
      });
    }

    const token = authHeader.split(" ")[1]; // remove Bearer
    if (!token) {
      return res.status(403).json({
        status: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // { id, email, role }

    // Update last_seen asynchronously
    if (decoded && decoded.id) {
      db.query("UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", [decoded.id])
        .catch(err => console.error("Activity tracking error:", err));
    }

    next();

  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token"
    });
  }
};
