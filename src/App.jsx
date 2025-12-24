import React from 'react';
import  {Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import {Toaster} from 'react-hot-toast';
import ContactList from './components/ContactList.jsx';


function App() {

  return ( 
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
<<<<<<< HEAD
      <Route path='/message' element={<MessagePage/>}/>
      <Route path='/contact' element={<ContactList/>}/>
=======
      {/* <Route path='/message' element={<MessagePage/>}/> */}
>>>>>>> 74cfe31b15197e2358f3801b46f84e0cdd18b827
    </Routes>
    </>
  )
}

export default App
