const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const auth = require("../middleware/auth.middleware");

router.post("/send", auth, chatController.sendMessage);
router.get("/history/:otherUserId", auth, chatController.getChatHistory);
router.get("/unread-count", auth, chatController.getUnreadCount);
router.get("/contacts", auth, chatController.getChatContacts);

module.exports = router;
