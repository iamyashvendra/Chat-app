import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen p-0 sm:p-4 md:p-6
      lg:px-[6%] lg:py-[3%]
      xl:px-[15%] xl:py-[3%]
    ">

      <div
        className="
        backdrop-blur-xl border border-gray-600 rounded-2xl 

        overflow-hidden
        h-full grid
        grid-cols-1

        sm:grid-cols-[35%_65%]   
        lg:grid-cols-[30%_70%]   
        xl:grid-cols-[30%_70%]
        "
      >

        {/* Sidebar */}
        <div className={`${selectedUser ? "max-sm:hidden" : ""}`}>
          <Sidebar />
        </div>

        {/* Chat */}
        <ChatContainer />

      </div>

    </div>
  );
};

export default HomePage;