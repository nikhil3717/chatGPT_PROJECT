require("dotenv").config();

const app = require("./src/App");
const connectDB = require("./src/db/db");
const { createServer } = require("http");

const initSocketServer = require("./src/socket/socket.Server");
const httpServer = createServer(app);
connectDB();

initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
