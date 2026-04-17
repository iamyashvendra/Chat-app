import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/UserRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://quickchat-gilt-three.vercel.app"
  ],
  credentials: true
}));

// Socket.io
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://quickchat-gilt-three.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Online users
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", senderId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// DB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
});