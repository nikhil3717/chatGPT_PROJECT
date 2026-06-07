require("dotenv").config();

const app = require("./src/App")
const connectDB = require("./src/db/db")
const {createServer} = require("http");

const initSocketServer = require("./src/socket/socket.Server")
const httpServer = createServer(app);
connectDB();

initSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000")
})