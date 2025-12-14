const express = require("express");
const chatAuthMiddleware = require("../middleware/chatAuth.middleware");
const {createChatController , getChatController , getAllMessages} = require("../controller/chat.controller");
const router = express.Router();

// POST api/chat
router.post("/",chatAuthMiddleware, createChatController )

router.get("/", chatAuthMiddleware, getChatController )

router.get("/messages/:id",chatAuthMiddleware,getAllMessages )

module.exports = router;


