import React, { useState, useEffect } from "react";
import ContactList from "../components/ContactList";
import Profile from "../components/Profile";
import ChatWindow from "../components/ChatWindow";
import socket from "../utils/socket.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from "axios";

const MessagePage = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [selectedUser, setSelectedUser] = useState(null);
  
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async (query = "") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/user${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search ? `?search=${search}` : "");
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- SELECT USER ---------------- */
  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setMessages([]);

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/message/get-messages/${user.receiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("joinUser", userId);

    return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const otherUserId =
        msg.sender === userId ? msg.receiver : msg.sender;

      setLastMessage((prev) => ({
        ...prev,
        [otherUserId]: msg.text || "Media",
      }));

      if (selectedUser?.receiverId === otherUserId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser, userId]);

  return (
    <div className="grid grid-cols-3 p-2 h-screen">
      <ContactList
        onUserSelect={handleUserSelect}
        search={search}
        users={users}
        setSearch={setSearch}
        lastMessage={lastMessage}
      />

      <ChatWindow
        receiverId={selectedUser?.receiverId}
        username={selectedUser?.username}
        messages={messages}
        />

      <Profile />
    </div>
  );
};

export default MessagePage;
