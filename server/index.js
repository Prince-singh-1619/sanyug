const dotenv = require("dotenv");
dotenv.config(); //load env variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const router = require("./routes/routes");
const serverSocketHandler = require("./serverSocket")

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

//middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: allowedOrigins,
    // credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "2mb" }));
// app.use(cookieParser())

const server = http.createServer(app);
// Creating socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    // origin: allowedOrigins,
    // credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
  },
});
// attach socket handler
serverSocketHandler(io);
// for controllers
app.set("io", io);

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/api", router);


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});