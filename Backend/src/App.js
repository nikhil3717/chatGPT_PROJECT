
const express = require("express");
const cookieParser = require("cookie-parser");
/* routers */
const authRoutes = require("./routes/userAuth.routes");
const chatRoutes = require("./routes/chat.routes")

const cors = require("cors")

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))
/* middlewares */
app.use(express.json())
app.use(cookieParser())

/* use routes */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app