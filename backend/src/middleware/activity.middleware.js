const db = require("../config/db");

module.exports = async (req, res, next) => {
    if (req.user && req.user.id) {
        try {
            // Background update, no need to wait or block the response
            db.query("UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?", [req.user.id])
                .catch(err => console.error("Activity tracking error:", err));
        } catch (error) {
            // Silently fail to not interrupt flow
        }
    }
    next();
};
