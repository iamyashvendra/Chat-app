const MessageSkeleton = () => {

  const skeleton = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      {skeleton.map((_, i) => (

        <div key={i} className="flex gap-3">

          <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>

          <div className="w-40 h-10 bg-gray-700 rounded-lg animate-pulse"></div>

        </div>

      ))}

    </div>
  );
};

export default MessageSkeleton;