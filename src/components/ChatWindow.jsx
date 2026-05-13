import { useState, useRef, useEffect } from "react";
import socket from "../utils/socket.jsx";
import { encryptText, decryptText } from "../utils/crypto";
import { IoSend } from "react-icons/io5";
import { FaComments, FaSmile } from "react-icons/fa";
import { getDateLabel, formatTime } from "../utils/dateUtils.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const ChatWindow = ({ receiverId, username, messages, onlineUsers, onOpenProfile }) => {
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const messagesRef = useRef(null);

  const isOnline = onlineUsers?.includes(receiverId?.toString());

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = getDateLabel(msg.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (!receiverId) return;
    if (!socket.connected) return;

    const encryptedText = encryptText(input);
    socket.emit("send-message", {
      receiverId,
      text: encryptedText,
      messageType: "text",
    });
    setInput("");
  };

  const getAvatarGradient = (name) => {
    const ch = (name || "U").charAt(0).toUpperCase();
    const code = ch.charCodeAt(0);
    const hue = (code * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 35) % 360}, 75%, 42%))`;
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden" style={{ background: "#fafbfd" }}>
      {!receiverId && !username ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-blue-50/50">
            <FaComments size={24} className="text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Select a Chat</h3>
          <p className="text-xs text-gray-400 max-w-[200px]">Start messaging your friends on UChat</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/50 transition-colors"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: getAvatarGradient(username) }}
            >
              {username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate leading-tight">
                {username}
              </h2>
              <p className={`text-[10px] font-bold ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto min-h-0 px-4 py-3"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.02) 0%, transparent 80%)"
            }}
          >
            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel}>
                <div className="flex items-center justify-center my-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400/60">
                    {dateLabel}
                  </span>
                </div>

                {msgs.map((msg) => {
                  const isMine = msg.sender !== receiverId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div
                        className="max-w-[85%] flex flex-col"
                        style={{
                          padding: "6px 10px",
                          borderRadius: isMine ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                          background: isMine ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "white",
                          color: isMine ? "white" : "#0f172a",
                          boxShadow: isMine ? "0 6px 16px -4px rgba(37,99,235,0.4)" : "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p className="text-xs font-bold leading-tight break-words">
                          {decryptText(msg.text)}
                        </p>
                        <span
                          className={`text-[9px] mt-1 self-end font-black ${
                            isMine ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white/80 backdrop-blur-md border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100 focus-within:border-blue-200 transition-colors">
              <input
                type="text"
                placeholder="Message..."
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                disabled={!input.trim()}
                onClick={handleSubmit}
                className="flex items-center justify-center h-8 w-8 rounded-xl text-white transition-all enabled:hover:scale-105 disabled:opacity-30"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 4px 8px -2px rgba(59,130,246,0.4)",
                }}
              >
                <IoSend size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
