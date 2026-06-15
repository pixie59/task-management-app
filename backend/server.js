import express from "express";
import authMiddleware from "./authMw.js"
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import boardRoutes from "./routes/board.js"
import taskRoutes from "./routes/task.js"
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/board",boardRoutes)
app.use("/api/task",taskRoutes)
app.get("/", (req, res) => {
  res.send("Backend running");
});
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("task-added", (task) => {
    console.log("Task event recieved",task);
    io.emit("task-added", task);
  });
  socket.on("task-deleted", (id) => {
  console.log("Task deleted", id);
  io.emit("task-deleted", id);
});
socket.on("task-moved", (task) => {
  console.log("Task moved", task);
  io.emit("task-moved", task);
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/dashboard",authMiddleware,(req,res)=>{
res.json("Welcome to dashboard")
})

