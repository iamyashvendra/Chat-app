import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { X } from "lucide-react";

const ProfileView = ({ onClose }) => {

  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter(m => m.image).map(m => m.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (

    // 🔥 BACKDROP
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex justify-center items-center p-3 sm:p-6">

      {/* 🔥 MAIN CARD */}
      <div className="
        w-full 
        max-w-sm sm:max-w-md 
        h-[92vh] sm:h-[85vh] 
        bg-[#1a1a2e]/80 backdrop-blur-2xl 
        border border-white/10 
        rounded-2xl 
        flex flex-col 
        overflow-hidden 
        text-white
        animate-[scaleIn_0.25s_ease]
      ">

        {/* 🔹 HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Profile</h2>

          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 🔹 PROFILE SECTION */}
        <div className="flex flex-col items-center gap-3 py-5 sm:py-6 px-4 sm:px-6">

          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-lg"
          />

          <h1 className="text-lg font-semibold flex items-center gap-2">

            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            )}

            {selectedUser.fullName}
          </h1>

          <p className="text-gray-400 text-sm text-center max-w-[280px] leading-relaxed">
            {selectedUser.bio || "No bio available"}
          </p>

        </div>

        {/* 🔹 MEDIA */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4">

          <h3 className="text-xs text-gray-400 mb-3 tracking-wide">
            MEDIA
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">

            {msgImages.length > 0 ? (
              msgImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => window.open(img)}
                  className="aspect-square object-cover rounded-lg cursor-pointer hover:scale-[1.05] transition"
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-3 text-center mt-10">
                No media shared
              </p>
            )}

          </div>

        </div>

        {/* 🔹 LOGOUT */}
        <div className="p-3 sm:p-4 border-t border-white/10">

          <button
            onClick={logout}
            className="
              w-full py-2 
              rounded-full 
              bg-gradient-to-r from-purple-500 to-violet-600 
              text-white text-sm font-medium 
              hover:opacity-90 transition
            "
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProfileView;