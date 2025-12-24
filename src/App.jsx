import React from 'react';
import  {Routes,Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import {Toaster} from 'react-hot-toast';


function App() {

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      {/* <Route path='/message' element={<MessagePage/>}/> */}
    </Routes>
    </>
  )
}

export default App
