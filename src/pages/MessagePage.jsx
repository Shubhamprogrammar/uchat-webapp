import React,{useState} from 'react';
import ContactList from '../components/ContactList';
import Profile from '../components/Profile';
import ChatWindow from '../components/ChatWindow';


const MessagePage = () => {

  const [activeConversationId, setActiveConversationId] = useState(null);
  return (
    <div className='grid grid-cols-3 gap-10 p-2'>
       <ContactList onSelectConversation={setActiveConversationId} />

      <ChatWindow conversationId={activeConversationId} />

      <Profile />
    </div>
  )
}

export default MessagePage
