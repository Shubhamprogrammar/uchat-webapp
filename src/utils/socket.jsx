import { io } from "socket.io-client";

const HOST = import.meta.env.VITE_BACKEND_URL;

const socket = io(HOST, {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: null,
  },
});
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});
export const connectSocket = () => {
  const token = localStorage.getItem("token");


  if (!token) return;

  socket.auth = {
    token: `Bearer ${token}`,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};


export default socket;
