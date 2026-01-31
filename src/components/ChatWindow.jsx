import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../utils/socket.jsx";
import { IoSend } from 'react-icons/io5';
import { getDateLabel,formatTime } from "../utils/dateUtils.jsx";

const ChatWindow = ({ receiverId, username, messages }) => {

  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");
  const HOST = import.meta.env.VITE_BACKEND_URL;

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = getDateLabel(msg.createdAt);

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);

    return acc;
  }, {});


  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        `${HOST}/api/message/send-message`,
        {
          receiverId,
          text: input,
          messageType: "text",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg bg-white">

      {/* EMPTY STATE */}
      {(!receiverId && !username) ? (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          Welcome to <span className="font-semibold text-blue-500 ml-1">UChat</span>!
          Select a user to start chatting.
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-b-gray-400 flex items-center ">
            <h2 className="text-blue-600 text-lg font-semibold">
              {username}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 ">
            {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
              <div key={dateLabel} className="space-y-1 scrollbar-hide">
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>

                {msgs.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === receiverId ? "justify-start" : "justify-end"
                      } mb-1`}
                  >
                    <div
                      className={`px-4 py-4 rounded-lg max-w-[70%] text-sm relative ${msg.sender === receiverId
                          ? "bg-gray-200 text-black rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                        }`}
                    >
                      <p>{msg.text}</p>

                      <span className={`text-[10px]  ${msg.sender === receiverId ? "text-black-100":"text-gray-200"} absolute right-2`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>


          {/* INPUT */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              disabled={!input.trim()}
              onClick={handleSubmit}
              className="
            flex items-center justify-center
            h-11 w-11 rounded-full
            bg-amber-500 text-white
            disabled:bg-gray-300 disabled:cursor-not-allowed
            hover:bg-amber-600 active:scale-95
            transition
          "
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
