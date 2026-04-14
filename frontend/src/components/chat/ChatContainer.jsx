import React, { useState, useContext, useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatSelected from "./NoChatSelected";
import ProfileView from "../ProfileView";

import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";

const ChatContainer = () => {

  const {
    messages,
    getMessages,
    selectedUser,
    showProfile,
    setShowProfile,
    users,
    typingUser
  } = useContext(ChatContext);

  const { authUser } = useContext(AuthContext);

  const [viewerImage, setViewerImage] = useState(null);

  const messageEndRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isConnected = users.some(u => u._id === selectedUser?._id);

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1">
        <NoChatSelected />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-3 pb-6">

        {/* 🔥 Typing indicator */}
        {typingUser === selectedUser._id && (
          <p className="text-xs text-gray-400 mb-2">
            {selectedUser.fullName} is typing...
          </p>
        )}

        {messages.map((msg) => {

          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 mb-4 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >

              {!isMe && (
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  className="w-7 rounded-full"
                />
              )}

              <div className="flex flex-col max-w-[220px]">

                {msg.image ? (
                  <img
                    src={msg.image}
                    onClick={() => setViewerImage(msg.image)}
                    className="rounded-lg cursor-pointer"
                  />
                ) : (
                  <p
                    className={`p-2 text-sm rounded-lg break-all ${
                      isMe
                        ? "bg-violet-500/30 text-white rounded-br-none"
                        : "bg-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}

                {/* 🔥 TIME + STATUS */}
                <span className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && ` • ${msg.seen ? "Seen" : "Sent"}`}
                </span>

              </div>

              {isMe && (
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  className="w-7 rounded-full"
                />
              )}

            </div>
          );
        })}

        <div ref={messageEndRef}></div>

      </div>

      {isConnected ? (
        <MessageInput />
      ) : (
        <div className="p-4 text-center text-gray-400 bg-black/20">
          Send request to start chatting
        </div>
      )}

      {viewerImage && (
        <div
          onClick={() => setViewerImage(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <img
            src={viewerImage}
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}

      {showProfile && (
        <ProfileView onClose={() => setShowProfile(false)} />
      )}

    </div>
  );
};

export default ChatContainer;