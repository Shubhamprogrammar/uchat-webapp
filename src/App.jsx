import React from 'react';
import  {Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import {Toaster} from 'react-hot-toast';
import ContactList from './components/ContactList.jsx';
import MessagePage from './pages/MessagePage.jsx';
import ChatWindow from './components/ChatWindow.jsx';

function App() {

  return ( 
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/message' element={<MessagePage/>}/>
      <Route path='/contact' element={<ContactList/>}/>
      <Route path='/message/chat' element={<ChatWindow/>}/>
    </Routes>
    </>
  )
}

export default App
