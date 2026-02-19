import React, { useState, useEffect, useRef, useCallback } from "react";
import ContactList from "../components/ContactList";
import Profile from "../components/Profile";
import ChatWindow from "../components/ChatWindow";
import socket from "../utils/socket.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from "axios";

const MessagePage = () => {
  const { user } = useAuth();
  // const myId = user?._id || user?.id;
  const HOST = import.meta.env.VITE_BACKEND_URL;

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);

  console.log("users", users)

  const token = localStorage.getItem("token");
  const activeChatRef = useRef(null);




  useEffect(() => {
    activeChatRef.current = selectedUser;
  }, [selectedUser]);


  useEffect(() => {
    socket.on("sync-active-chat", () => {
      socket.emit(
        "active-chat",
        activeChatRef.current?.conversationId || null
      );
    });

    return () => socket.off("sync-active-chat");
  }, []);

  // FETCH CONTACT LIST
  const fetchUsers =
    async (query = "") => {
      try {
        const res = await axios.get(`${HOST}/api/auth/user${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search ? `?search=${search}` : "");
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // SELECT CONTACT
  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    activeChatRef.current = user;


    socket.emit("active-chat", user.conversationId || null);
    setMessages([]);

    if (!user.conversationId) return;
    try {
      const res = await axios.get(
        `${HOST}/api/message/get-messages/${user.receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(res.data.messages || []);

      socket.emit("mark-seen", {
        conversationId: user.conversationId,
        senderId: user.receiverId,
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === user.receiverId
            ? { ...u, unreadCount: 0 }
            : u
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      const activeChat = activeChatRef.current;

      //  First message conversation sync
      if (msg.isNewConversation) {
        setUsers(prev =>
          prev.map(u =>
            u._id === msg.sender
              ? { ...u, conversationId: msg.conversationId }
              : u
          )
        );

        if (activeChat?._id === msg.sender) {
          const updated = { ...activeChat, conversationId: msg.conversationId };
          activeChatRef.current = updated;
          setSelectedUser(updated);
        }
      }

      const isChatOpen =
        activeChatRef.current?.conversationId === msg.conversationId;

      if (isChatOpen) {
        setMessages(prev => [...prev, msg]);

        socket.emit("mark-seen", {
          conversationId: msg.conversationId,
          senderId: msg.sender
        });
      }

      setUsers(prev =>
        prev.map(u =>
          u._id === msg.sender
            ? {
              ...u,
              lastMessage: msg.text,
              unreadCount: isChatOpen ? 0 : (u.unreadCount || 0) + 1
            }
            : u
        )
      );
    };


    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // SOCKET SEND SUCCESS
  useEffect(() => {
    const handleSendSuccess = (payload) => {
      let activeChat = activeChatRef.current;

      if (payload.isNewConversation) {
        const updated = {
          ...activeChat,
          conversationId: payload.conversationId
        };

        activeChatRef.current = updated;
        setSelectedUser(updated);

        setUsers(prev =>
          prev.map(u =>
            u._id === payload.receiver
              ? { ...u, conversationId: payload.conversationId }
              : u
          )
        );
      }

      if (activeChatRef.current?.conversationId === payload.conversationId) {
        setMessages(prev => [...prev, payload]);
      }

      setUsers(prev =>
        prev.map(u =>
          u._id === payload.receiver
            ? { ...u, lastMessage: payload.text, unreadCount: 0 }
            : u
        )
      );
    };

    socket.on("send-success", handleSendSuccess);

    return () => socket.off("send-success", handleSendSuccess);
  }, []);



  useEffect(() => {
    socket.on("unread-reset", ({ conversationId }) => {
      setUsers(prev =>
        prev.map(u =>
          u.conversationId === conversationId
            ? { ...u, unreadCount: 0 }
            : u
        )
      );
    });

    return () => socket.off("unread-reset");
  }, []);


  return (
    <div className="grid grid-cols-3 p-2 h-screen">
      <ContactList
        onUserSelect={handleUserSelect}
        search={search}
        users={users}
        setSearch={setSearch}
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
