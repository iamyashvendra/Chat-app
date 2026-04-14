import React, { useContext } from "react";
import { X } from "lucide-react";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import assets from "../../assets/assets";

const ChatHeader = () => {

  const { selectedUser, setSelectedUser, setShowProfile } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);

  return (
    <div className="p-3 border-b border-gray-700">

      <div className="flex items-center justify-between">

        {/* USER INFO */}
        <div
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 cursor-pointer"
        >

          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>

            <h3 className="font-medium text-white">
              {selectedUser?.fullName}
            </h3>

            <p className="text-xs text-gray-400 flex items-center gap-1">

              {onlineUsers.includes(selectedUser._id) && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}

              {onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"}

            </p>

          </div>

        </div>

        {/* CLOSE CHAT */}
        <button onClick={() => setSelectedUser(null)}>
          <X size={20} />
        </button>

      </div>

    </div>
  );
};

export default ChatHeader;