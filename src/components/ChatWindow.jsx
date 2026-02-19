import { useState, useRef, useEffect } from "react";
import socket from "../utils/socket.jsx";
import { encryptText, decryptText } from "../utils/crypto";
import { IoSend } from 'react-icons/io5';
import { getDateLabel, formatTime } from "../utils/dateUtils.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const ChatWindow = ({
  receiverId,
  username,
  messages
}) => {

  const [input, setInput] = useState("");
  const { user } = useAuth();
  const messagesRef = useRef(null);

  const groupedMessages = messages.reduce((acc, msg) => { const dateKey = getDateLabel(msg.createdAt); if (!acc[dateKey]) acc[dateKey] = []; acc[dateKey].push(msg); return acc; }, {});

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

const handleSubmit = () => {
  if (!input.trim()) return;

  if (!receiverId) {
    console.log("No receiver selected");
    return;
  }

  if (!socket.connected) {
    console.log("Socket not connected");
    return;
  }
  
  const encryptedText = encryptText(input);

  console.log("enCrpytedText",encryptText)

  socket.emit("send-message", {
    receiverId,
    text: encryptedText,
    messageType: "text",
  });

  
  setInput("");
};


  return (
    <div className="h-full min-h-0 flex flex-col rounded-lg bg-white">

      {(!receiverId && !username) ? (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          Welcome to <span className="font-semibold text-blue-500 ml-1">UChat</span>!
          Select a user to start chatting.
        </div>
      ) : (
        <>
          <div className="px-4 py-3 border-b border-b-gray-400 flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {username?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-blue-600 text-lg font-semibold pl-2">
              {username}
            </h2>
          </div>

          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto min-h-0 px-4 py-2"
          >
            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel} className="space-y-1">
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>

                {msgs.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender === receiverId
                        ? "justify-start"
                        : "justify-end"
                    } mb-1`}
                  >
                    <div
                      className={`px-4 py-4 rounded-lg max-w-[70%] text-sm relative ${
                        msg.sender === receiverId
                          ? "bg-gray-200 text-black rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      <p>{decryptText(msg.text)}</p>
                      <span
                        className={`text-[9px] absolute right-2 ${
                          msg.sender === receiverId
                            ? "text-black"
                            : "text-gray-200"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-white">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <button
              disabled={!input.trim()}
              onClick={handleSubmit}
              className="flex items-center justify-center h-11 w-11 cursor-pointer rounded-full bg-amber-500 text-white disabled:bg-gray-300"
            >
              <IoSend size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
