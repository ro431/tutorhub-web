const db = require("../config/db");

async function sendMessage(senderId, receiverId, message) {
    const [result] = await db.query(
        "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
        [senderId, receiverId, message]
    );
    return result;
}

async function getChatHistory(user1Id, user2Id) {
    const [rows] = await db.query(
        `SELECT m.*, 
            s.name as sender_name, s.profile as sender_profile,
            r.name as receiver_name, r.profile as receiver_profile
     FROM messages m
     JOIN users s ON m.sender_id = s.id
     JOIN users r ON m.receiver_id = r.id
     WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
        [user1Id, user2Id, user2Id, user1Id]
    );
    return rows;
}

async function getUnreadCount(userId) {
    const [rows] = await db.query(
        "SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = FALSE",
        [userId]
    );
    return rows[0].count;
}

async function markMessagesAsRead(senderId, receiverId) {
    const [result] = await db.query(
        "UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?",
        [senderId, receiverId]
    );
    return result;
}

async function getChatContacts(userId) {
    // For teachers, get students they teach. For students, get teachers they study with.
    // However, to be more general for a message icon, let's get anyone they have ever chatted with.
    const [rows] = await db.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.profile, u.role, u.last_seen
         FROM users u
         JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
         WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?`,
        [userId, userId, userId]
    );
    return rows;
}

module.exports = {
    sendMessage,
    getChatHistory,
    getUnreadCount,
    markMessagesAsRead,
    getChatContacts
};
