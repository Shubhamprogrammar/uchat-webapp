import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaComments, FaEllipsisV, FaSearch } from 'react-icons/fa';


const ContactList = ({ onUserSelect, lastMessage, unreadCount, search, setSearch, users }) => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

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
          <FaEllipsisV className="text-xl text-gray-500 absolute relative top-4 cursor-pointer" onClick={() => setOpen(true)} />

          {open && (
            <div className='p-2 m-2 absolute top-6  '>
              <button onClick={handleClick} className='w-full cursor-pointer p-2 border border-blue-500 bg-blue-500 text-white rounded'>Logout</button>
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
      {users?.map((user) => (
        <div
          key={user._id}
          onClick={() =>
            onUserSelect({
              receiverId: user._id,
              username: user.username,
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
              <p className="text-gray-500 text-sm">{lastMessage?.[user._id] ||
                user.lastMessage}</p>
                 {unreadCount[user._id] > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full px-2">
                {unreadCount[user._id]}
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
