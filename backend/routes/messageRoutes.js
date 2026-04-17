import express from "express";
import { protectRoute } from "../middleware/auth.js";
import ChatRequest from "../models/ChatRequest.js";
import { io, userSocketMap } from "../server.js";

import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();


// SEND REQUEST
messageRouter.post("/request/send", protectRoute, async (req, res) => {
  const { receiverId } = req.body;

  const existing = await ChatRequest.findOne({
    senderId: req.user._id,
    receiverId,
  });

  if (existing) {
    return res.json({
      success: false,
      message: "Already requested",
    });
  }

  await ChatRequest.create({
    senderId: req.user._id,
    receiverId,
  });

  const receiverSocketId = userSocketMap[receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newRequest");
  }

  res.json({ success: true });
});


// GET REQUESTS
messageRouter.get("/request", protectRoute, async (req, res) => {

  const requests = await ChatRequest.find({
    receiverId: req.user._id,
    status: "pending",
  }).populate("senderId");

  const sentRequests = await ChatRequest.find({
    senderId: req.user._id,
    status: "pending",
  }).populate("receiverId");

  res.json({
    success: true,
    requests,
    sentRequests,
  });
});


// ACCEPT / REJECT
messageRouter.put("/request/handle", protectRoute, async (req, res) => {

  const { requestId, action } = req.body;

  const request = await ChatRequest.findById(requestId);

  if (!request) {
    return res.json({ success: false });
  }

  request.status = action;
  await request.save();

  const senderSocketId =
    userSocketMap[request.senderId.toString()];

  const receiverSocketId =
    userSocketMap[request.receiverId.toString()];

  if (senderSocketId) {
    io.to(senderSocketId).emit("requestUpdated");
  }

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("requestUpdated");
  }

  res.json({ success: true });
});


// NORMAL ROUTES
messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;