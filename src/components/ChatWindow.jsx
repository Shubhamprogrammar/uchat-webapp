import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../utils/socket.jsx";

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // 1️⃣ Fetch old messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/get-messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // 2️⃣ Socket connection + join room
  useEffect(() => {
    if (!conversationId) return;

    socket.connect();
    socket.emit("joinConversation", conversationId);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [conversationId]);

  // 3️⃣ Send message
  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/message/send-message",
        {
          receiverId: conversationId,
          messageType: "text",
          text: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading && <p>Loading messages...</p>}

      {messages.map((msg) => (
        <div key={msg._id}>
          <p>
            <b>{msg.sender?.name || "You"}:</b> {msg.text}
          </p>
        </div>
      ))}

      <input
        type="text"
        placeholder="Type..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatWindow;
