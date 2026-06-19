const chatService = require("../services/chat.service");

async function sendMessage(req, res) {
    const { receiver_id, message } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message) {
        return res.status(400).json({ status: false, msg: "Receiver ID and message are required" });
    }

    try {
        const result = await chatService.sendMessage(sender_id, receiver_id, message);
        res.status(201).json({ status: true, msg: "Message sent", data: result });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getChatHistory(req, res) {
    const user1_id = req.user.id;
    const user2_id = req.params.otherUserId;

    try {
        const messages = await chatService.getChatHistory(user1_id, user2_id);
        // Mark messages from the other user as read when we open the chat
        await chatService.markMessagesAsRead(user2_id, user1_id);
        res.json({ status: true, data: messages });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getUnreadCount(req, res) {
    const user_id = req.user.id;
    try {
        const count = await chatService.getUnreadCount(user_id);
        res.json({ status: true, data: count });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

async function getChatContacts(req, res) {
    const user_id = req.user.id;
    try {
        const contacts = await chatService.getChatContacts(user_id);
        res.json({ status: true, data: contacts });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
}

module.exports = {
    sendMessage,
    getChatHistory,
    getUnreadCount,
    getChatContacts
};
