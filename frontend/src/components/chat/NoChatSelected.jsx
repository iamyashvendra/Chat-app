import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">

      <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center animate-bounce">
        <MessageSquare className="w-8 h-8 text-purple-400" />
      </div>

      <h2 className="text-xl font-semibold text-white">
        Chat anytime, anywhere
      </h2>

      <p className="text-gray-400 text-sm">
        Select a conversation from the sidebar
      </p>

    </div>
  );
};

export default NoChatSelected;