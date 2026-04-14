import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";
import { v2 as cloudinary } from "cloudinary";
import ChatRequest from "../models/ChatRequest.js";

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 all users except me
    const allUsers = await User.find({
      _id: { $ne: userId }
    }).select("-password");

    // 🔥 accepted connections
    const acceptedRequests = await ChatRequest.find({
      $or: [
        { senderId: userId, status: "accepted" },
        { receiverId: userId, status: "accepted" }
      ]
    });

    const connectedUserIds = acceptedRequests.map(req =>
      req.senderId.toString() === userId.toString()
        ? req.receiverId.toString()
        : req.senderId.toString()
    );

    // 🔥 split users
    const connectedUsers = allUsers.filter(u =>
      connectedUserIds.includes(u._id.toString())
    );

    const otherUsers = allUsers.filter(u =>
      !connectedUserIds.includes(u._id.toString())
    );

    res.json({
      success: true,
      connectedUsers,
      otherUsers
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // ✅ CHECK REQUEST FIRST
    const request = await ChatRequest.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ],
      status: "accepted"
    });

    if (!request) {
      return res.json({
        success: false,
        message: "Request not accepted",
      });
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};