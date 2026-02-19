import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaComments, FaEllipsisV, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { decryptText } from "../utils/crypto";

const ContactList = ({ onUserSelect, search, setSearch, users }) => {

  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const sortedUsers = [...users].sort((a, b) => {
    return new Date(b.lastMessage?.createdAt || 0) -
      new Date(a.lastMessage?.createdAt || 0);
  });

  

  const handleClick = () => {
    logout();
    setOpen(false);
  }

  return (
    <section className='border-r border-r-gray-400'>
      <div className='flex justify-between mr-5'>
        <div className="flex items-center justify-center gap-3 ml-4 mb-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
            <FaComments className="text-xl text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">U</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">chat</span>
          </h1>
        </div>
        <div>
          <FaEllipsisV className="text-xl text-gray-500 absolute top-4 cursor-pointer" onClick={() => setOpen(true)} />

          {open && (
            <div
              className="absolute top-8 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-dropdown"
            >
              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition ">
                Cancel
                <span className="text-xs">✕</span>
              </button>

              <div className="h-px bg-gray-200" />

              <button
                onClick={handleClick}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <FaSignOutAlt className="text-base" />
                Logout
              </button>
            </div>
          )}

        </div>
      </div>
      {/* <h2 className='text-xl font-semibold text-gray-700 ml-2  right-0'>Contacts</h2> */}
      <div className='relative w-full m-auto px-2'>

        <FaSearch className='absolute left-5 top-1/2 -translate-y-1/2 text-small text-gray-600' />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search...."
          className='pl-10 py-2 m-auto w-full border border-gray-500 font-medium rounded-full' />

      </div>
      {sortedUsers?.map((user) => (
        <div
          key={user.conversationId || user._id}
          onClick={() =>
            onUserSelect({
              receiverId: user.receiver,
              username: user.username,
              conversationId: user.conversationId,
            })
          }
          className="cursor-pointer"
        >
          <div className="flex items-center p-3 border-b border-gray-300 hover:bg-gray-100">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.name?.[0]}
            </div>

            <div className="ml-4">
              <p className="text-gray-800 font-medium">{user.username}</p>
              <p className="text-gray-500 text-sm">{
                decryptText(user.lastMessage)}</p>
              {user.unreadCount > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2">
                  {user.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}



    </section>
  )
}

export default ContactList
