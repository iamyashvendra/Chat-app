import express from "express";
import { protectRoute } from "../middleware/auth.js";
import ChatRequest from "../models/ChatRequest.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// ✅ REQUEST ROUTES FIRST
messageRouter.post("/request/send", protectRoute, async (req, res) => {
  const { receiverId } = req.body;

  const existing = await ChatRequest.findOne({
    senderId: req.user._id,
    receiverId,
  });

  if (existing) {
    return res.json({ success: false, message: "Already requested" });
  }

  await ChatRequest.create({
    senderId: req.user._id,
    receiverId,
  });

  res.json({ success: true });
});

messageRouter.get("/request", protectRoute, async (req, res) => {
  const requests = await ChatRequest.find({
    receiverId: req.user._id,
    status: "pending",
  }).populate("senderId");

  const sentRequests = await ChatRequest.find({
    senderId: req.user._id,
    status: "pending",
  }).populate("receiverId");

  res.json({ success: true, requests, sentRequests });
});

messageRouter.put("/request/handle", protectRoute, async (req, res) => {
  const { requestId, action } = req.body;

  const request = await ChatRequest.findById(requestId);
  if (!request) return res.json({ success: false });

  request.status = action;
  await request.save();

  res.json({ success: true });
});

// ✅ NORMAL ROUTES AFTER
messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;