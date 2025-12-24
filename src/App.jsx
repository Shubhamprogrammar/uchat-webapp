import React from 'react';
import  {Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import MessagePage from './pages/MessagePage.jsx';
import {Toaster} from 'react-hot-toast';
import ContactList from './components/ContactList.jsx';


function App() {

  return ( 
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/message' element={<MessagePage/>}/>
      <Route path='/contact' element={<ContactList/>}/>
    </Routes>
    </>
  )
}

export default App
