import React,{useState,useEffect} from 'react';
import ContactList from '../components/ContactList';
import Profile from '../components/Profile';
import ChatWindow from '../components/ChatWindow';
import socket from '../utils/socket.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';


const MessagePage = () => {

  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect=(user)=>{
    setSelectedUser(user);
  }

  

  const { user } = useAuth();
  const userId = user?.id; 
  // or from auth context

  useEffect(() => {
    // CONNECT SOCKET ONCE
    socket.connect();

    // 🔥 JOIN USER ROOM (CRITICAL)
    socket.emit("joinUser", userId);

    return () => {
      socket.disconnect();
    };
  }, [userId]);
  return (
    <div className='grid grid-cols-3 p-2'>
       <ContactList onUserSelect={handleUserSelect} />

      <ChatWindow 
      receiverId={selectedUser?.receiverId} 
      username={selectedUser?.username} 
      />

      <Profile />
    </div>
  )
}

export default MessagePage
