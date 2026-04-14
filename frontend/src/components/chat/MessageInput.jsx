import React, { useContext, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const MessageInput = () => {

  const { sendMessage, selectedUser } = useContext(ChatContext);
  const { socket, authUser } = useContext(AuthContext);

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-full">

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} className="w-20 h-20 object-cover rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">

        <div className="flex-1 flex gap-2">

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-white/10 px-4 py-2 rounded-lg outline-none text-white"
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              // 🔥 typing emit
              socket.emit("typing", {
                senderId: authUser._id,
                receiverId: selectedUser._id,
              });
            }}
          />

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
          />

          <button type="button" onClick={() => fileInputRef.current.click()} className="p-2">
            <Image size={20} />
          </button>

        </div>

        <button type="submit">
          <Send size={22} />
        </button>

      </form>

    </div>
  );
};

export default MessageInput;