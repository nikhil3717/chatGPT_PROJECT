const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model")

async function createChatController(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    user: user._id,
    title
  })

  return res.status(201).json({
    message: "Chat created successfully",
    chat: {
      id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity
    }
  })


}

async function getChatController(req, res) {
  const user = req.user

  const chats = await chatModel.find({ user: user._id })

  return res.status(200).json({
    message: "chat find successfully",
       chat:chats.map((chat) => ({
          _id:chat._id,
          title:chat.title,
          lastActivity: chat.lastActivity,
          user:chat.user
    }))
  })
}


async function getAllMessages(req,res) {
    const chatId = req.params.id
    
    const message = await messageModel.find({chat:chatId}).sort({createdAt:1})

    res.status(200).json({
      messages : "messages get successfully",
      message: message
    })

}





module.exports = { createChatController, getChatController ,getAllMessages };