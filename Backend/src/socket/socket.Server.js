const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateContent, generateEmbedding } = require("../service/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../service/vector.service");
const cors = require("cors")

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    try {
      const decoded = await jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    console.log("User connected:");
    console.log("A user connected with socketId:", socket.id);


    socket.on("ai-message", async (messagePayload) => {
      try {
        console.log("Received message:", messagePayload);

        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: user._id,
            content: messagePayload.content,
            role: "user",
          }),
          generateEmbedding(messagePayload.content)
        ]);

        console.log("User message saved and embedding generated");

        const [memory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 2,
            metadata: {
              user: user._id
            }
          })
        ]);

        console.log("Memory retrieved:", memory.length, "items");

        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: user._id,
            text: messagePayload.content
          },
        });

        let chatHistory = (
          await messageModel
            .find({
              chat: messagePayload.chat,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse();

        let stm = chatHistory.map((msg) => {
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        });

        let ltm = [
          {
            role: "user",
            parts: [{ text: `These are some previous messages from the chat:\n${memory.map(item => item.metadata?.text || "").join("\n")}` }]
          }
        ];

        console.log("Chat history prepared, sending to AI...");

        const response = await generateContent([...ltm, ...stm]);

        console.log("AI response generated successfully");

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });

        const messageResponse = await messageModel.create({
          chat: messagePayload.chat,
          user: user._id,
          content: response,
          role: "model",
        });

        const responseVectors = await generateEmbedding(response);
        await createMemory({
          vectors: responseVectors,
          messageId: messageResponse._id,
          metadata: {
            chat: messagePayload.chat,
            user: user._id,
            text: response
          },
        });

        console.log("AI response saved successfully");
      } catch (error) {
        console.error("Error processing AI message:", error.message);
        console.error("Full error:", error);
        socket.emit("ai-response", {
          content: "Sorry, I encountered an error processing your message. Please try again.",
          chat: messagePayload.chat,
          error: true
        });
      }
    });
  });
  return io;
};

module.exports = initSocketServer;
