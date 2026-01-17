import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../utils/socket.jsx";
import { IoSend } from 'react-icons/io5'

const ChatWindow = ({ receiverId,username }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("token");

  // Fetch old messages

    useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  

useEffect(() => {
    if (!receiverId) return;

    const loadConversation = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/get-messages/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.conversationId) {
          setConversationId(res.data.conversationId);
          setMessages(res.data.messages);
          console.log("messages",res.data.messages);
          socket.emit("joinConversation", res.data.conversationId);
        } else {
          setMessages([]);
          setConversationId(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [receiverId]);


   const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/message/send-message",
        {
          receiverId,
          text: input,
          messageType: "text",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      if (!conversationId) {
        setConversationId(res.data.conversationId);
        socket.emit("joinConversation", res.data.conversationId);
      }

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
      <div className="px-4 py-3 border-b border-b-gray-400 flex items-center">
        <h2 className="text-blue-600 text-lg font-semibold">
          {username}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender !== receiverId ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`
                px-4 py-2 rounded-lg max-w-[70%] text-sm
                ${
                  msg.sender !== receiverId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }
              `}
            >
              {msg.text}
            </p>
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
