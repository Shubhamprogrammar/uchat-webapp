import React,{useEffect} from 'react';
import socket from 'socket.io-client';

const ChatWindow = (setShow) => {

  // socket.on('joinConversation', (conversationId) => {
  //   socket.join(conversationId);
  // });

  useEffect((aysnc)=>{
    try{

    }
    catch(err){

    }

  })

  return (

    <div>
    {setShow &&<div>Hello</div>}  
    </div>
  )
}

export default ChatWindow
