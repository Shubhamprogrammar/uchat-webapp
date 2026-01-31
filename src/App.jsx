import React from 'react';
import  {Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import {Toaster} from 'react-hot-toast';
import ContactList from './components/ContactList.jsx';
import MessagePage from './pages/MessagePage.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import DesktopOnly from './components/DesktopOnly.jsx';

function App() {

  return ( 
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <DesktopOnly>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/message' element={
        <ProtectedRoute>
        <MessagePage/>
        </ProtectedRoute>
        }/>
      <Route path='/contact' element={
        <ProtectedRoute>
        <ContactList/>
        </ProtectedRoute>}/>
      <Route path='/message/chat' element={
        <ProtectedRoute>
        <ChatWindow/>
        </ProtectedRoute>
        }/>
    </Routes>
    </DesktopOnly>
    </>
  )
}

export default App
