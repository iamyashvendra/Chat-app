import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const {
    getUsers,
    users,
    otherUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    requests,
    sentRequests,
    getRequests,
    handleRequest,
    sendRequest
  } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)

  const [input, setInput] = useState("")
  const [showRequests, setShowRequests] = useState(false)

  const navigate = useNavigate()

  // ✅ IMPORTANT LOGIC
  const filteredUsers = input
    ? [...users, ...otherUsers].filter((user) =>
      user.fullName.toLowerCase().includes(input.toLowerCase())
    )
    : users

  useEffect(() => {
    getUsers()
    getRequests()
  }, [onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 overflow-y-auto text-white ${selectedUser ? "max-md:hidden" : ""}`}>

      {/* TOP */}
      <div className='pb-5 relative'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} className='max-w-40' />

          <div className="flex items-center gap-3">

            {/* 🔔 REQUEST ICON */}
            <div
              className="relative cursor-pointer"
              onClick={() => setShowRequests(prev => !prev)}
            >
              <span className="text-xl">🔔</span>

              {requests?.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 px-1 rounded-full">
                  {requests.length}
                </span>
              )}
            </div>

            {/* MENU */}
            <div className="relative py-2 group">
              <img src={assets.menu_icon} className='max-h-5 cursor-pointer' />

              <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
              bg-[#282142] border border-gray-600 hidden group-hover:block'>

                <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>
                  Edit Profile
                </p>

                <hr className="my-2 border-gray-500" />

                <p onClick={() => logout()} className='cursor-pointer text-sm'>
                  Logout
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* 🔥 REQUEST POPUP */}
        {showRequests && (
          <div className="absolute top-16 left-0 right-0 bg-[#1e1a3a] border border-white/10 rounded-lg p-3 z-50">

            {/* 🔥 INCOMING */}
            <p className="text-sm mb-2 text-gray-300">Incoming</p>

            {requests?.length === 0 && (
              <p className="text-xs text-gray-400 mb-2">No incoming requests</p>
            )}

            {requests?.map((req) => (
              <div key={req._id} className="flex justify-between items-center mb-2">

                <div className="flex gap-2 items-center">
                  <img
                    src={req.senderId.profilePic || assets.avatar_icon}
                    className="w-7 rounded-full"
                  />
                  <p className="text-sm">{req.senderId.fullName}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(req._id, "accepted")}
                    className="text-green-400"
                  >✔</button>

                  <button
                    onClick={() => handleRequest(req._id, "rejected")}
                    className="text-red-400"
                  >✖</button>
                </div>

              </div>
            ))}

            {/* 🔥 SENT */}
            <p className="text-sm mt-4 mb-2 text-gray-300">Pending</p>

            {sentRequests?.length === 0 && (
              <p className="text-xs text-gray-400">No pending requests</p>
            )}

            {sentRequests?.map((req) => (
              <div key={req._id} className="flex items-center gap-2 mb-2 opacity-70">

                <img
                  src={req.receiverId.profilePic || assets.avatar_icon}
                  className="w-7 rounded-full"
                />

                <p className="text-sm">{req.receiverId.fullName}</p>

                <span className="ml-auto text-xs text-yellow-400">
                  Pending
                </span>

              </div>
            ))}

          </div>
        )}

        {/* SEARCH */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} className='w-3' />
          <input
            onChange={(e) => setInput(e.target.value)}
            placeholder='Search User...'
            className='bg-transparent outline-none text-xs flex-1'
          />
        </div>
      </div>

      {/* 🔥 CHATS */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Chats</p>

        {filteredUsers?.map((user) => {
          const isNewUser = !users.find(u => u._id === user._id)

          return (
            <div
              key={user._id}
              onClick={() => {
                if (!isNewUser) {
                  setSelectedUser(user)
                  setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                }
              }}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedUser?._id === user._id && "bg-[#282142]/50"
                }`}
            >
              <img src={user.profilePic || assets.avatar_icon} className="w-8 rounded-full" />
              <p>{user.fullName}</p>

              {/* 🔥 REQUEST BUTTON */}
              {isNewUser ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    sendRequest(user._id)
                  }}
                  className="ml-auto text-xs bg-violet-500 px-2 py-1 rounded"
                >
                  Request
                </button>
              ) : (
                unseenMessages[user._id] > 0 && (
                  <span className="ml-auto text-xs bg-violet-500/50 px-2 py-0.5 rounded-full">
                    {unseenMessages[user._id]}
                  </span>
                )
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Sidebar