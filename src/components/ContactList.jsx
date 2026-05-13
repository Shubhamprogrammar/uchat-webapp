import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaComments, FaEllipsisV, FaSearch, FaSignOutAlt, FaTimes, FaUserCircle } from 'react-icons/fa';
import { decryptText } from "../utils/crypto";

const ContactList = ({ onUserSelect, search, setSearch, users, selectedUserId, onlineUsers, onOpenMyProfile }) => {

  const { logout, user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const sortedUsers = [...users].sort((a, b) => {
    return new Date(b.lastMessage?.createdAt || 0) -
      new Date(a.lastMessage?.createdAt || 0);
  });

  const handleClick = () => {
    logout();
    setOpen(false);
  };

  const getAvatarGradient = (name) => {
    const ch = (name || "U").charAt(0).toUpperCase();
    const code = ch.charCodeAt(0);
    const hue = (code * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 35) % 360}, 75%, 42%))`;
  };

  return (
    <section
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* ─── Header ─── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenMyProfile}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm hover:scale-105 transition-all cursor-pointer overflow-hidden border-2 border-white/50"
              style={{ background: getAvatarGradient(currentUser?.username || "Me") }}
            >
              {currentUser?.photo ? (
                <img src={currentUser.photo} alt="me" className="w-full h-full object-cover" />
              ) : (
                currentUser?.username?.[0]?.toUpperCase() || "M"
              )}
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #d97706)" }}>U</span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #1e40af, #1e3a8a)" }}>chat</span>
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/50 border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all cursor-pointer shadow-sm"
            >
              <FaEllipsisV size={12} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div 
                  className="absolute right-0 top-11 w-44 rounded-2xl z-50 overflow-hidden py-1.5" 
                  style={{ 
                    background: "rgba(255,255,255,0.9)", 
                    backdropFilter: "blur(20px)", 
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" 
                  }}
                >
                  <button 
                    onClick={() => { onOpenMyProfile(); setOpen(false); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <FaUserCircle size={14} className="opacity-70" />
                    My Profile
                  </button>
                  <div className="h-px bg-gray-50 mx-2 my-1" />
                  <button 
                    onClick={handleClick} 
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FaSignOutAlt size={14} className="opacity-70" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative mt-2">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <FaSearch className="text-gray-400" size={13} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-bold text-gray-700 placeholder-gray-400 transition-all duration-200 focus:outline-none bg-white border border-gray-200 shadow-sm focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 mt-2">
        {sortedUsers.map((user) => {
          const userId = user.receiver || user._id;
          const isActive = selectedUserId === userId;
          const isOnline = onlineUsers?.includes(userId?.toString());
          const lastMsg = decryptText(user.lastMessage);

          return (
            <div
              key={user.conversationId || user._id}
              onClick={() => onUserSelect({ receiverId: userId, username: user.username, conversationId: user.conversationId })}
              className="cursor-pointer mb-1"
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(59,130,246,0.1)" : "1px solid transparent",
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: getAvatarGradient(user.name) }}>
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-800 truncate">{user.username}</p>
                    {user.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full bg-green-500">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{lastMsg || "Tap to chat"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactList;
