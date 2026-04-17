import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [typingUser, setTypingUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const { socket, axios } = useContext(AuthContext);

  // 🔥 REQUESTS
  const getRequests = async () => {
    try {
      const { data } = await axios.get("/api/messages/request");
      if (data.success) {
        setRequests(data.requests || []);
        setSentRequests(data.sentRequests || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      const { data } = await axios.post("/api/messages/request/send", {
        receiverId,
      });

      if (data.success) {
        toast.success("Request sent");
        getRequests();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      await axios.put("/api/messages/request/handle", {
        requestId,
        action,
      });

      getRequests();
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 USERS
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.connectedUsers || []);
        setOtherUsers(data.otherUsers || []);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔥 MESSAGES
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔥 SEND MESSAGE
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages(prev => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔥 SOCKET (FINAL CLEAN VERSION)
  useEffect(() => {
  if (!socket) return;

  socket.on("newMessage", (msg) => {
    if (selectedUser && msg.senderId === selectedUser._id) {
      setMessages((prev) => [...prev, msg]);
    } else {
      setUnseenMessages((prev) => ({
        ...prev,
        [msg.senderId]: (prev[msg.senderId] || 0) + 1,
      }));
    }
  });

  socket.on("typing", (userId) => {
    setTypingUser(userId);
    setTimeout(() => setTypingUser(null), 1500);
  });

  socket.on("newRequest", () => {
    getRequests();
  });

  socket.on("requestUpdated", () => {
    getRequests();
    getUsers();
  });

  return () => {
    socket.off("newMessage");
    socket.off("typing");
    socket.off("newRequest");
    socket.off("requestUpdated");
  };
}, [socket, selectedUser]);

  const value = {
    messages,
    users,
    otherUsers,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
    typingUser,
    setTypingUser,
    showProfile,
    setShowProfile,
    requests,
    sentRequests,
    getRequests,
    sendRequest,
    handleRequest,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};