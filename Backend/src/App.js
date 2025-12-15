
const express = require("express");
const cookieParser = require("cookie-parser");
/* routers */
const authRoutes = require("./routes/userAuth.routes");
const chatRoutes = require("./routes/chat.routes")

const cors = require("cors")
const path = require("path")


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}))
/* middlewares */
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"../public")))

/* use routes */
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


app.get("*name", (req,res) => {
  res.sendFile(path.join(_dirname,"../public/index.html"))
})


module.exports = app