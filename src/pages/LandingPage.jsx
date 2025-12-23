import React, { useState } from 'react';
import Uchat from '../assets/Uchat-logo.png';
import ChatImage from '../assets/ChatImage.jpg';
import Signup from '../components/Signup';
import Login from '../components/Login';
import { FaComments } from "react-icons/fa";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto  gap-8 shadow-lg bg-white rounded-lg">


        {/* Left Section - Signup Form */}



        <div className={`w-full md:w-1/2 flex flex-col justify-center backdrop-blur-md  h-screen`}>




          {!showLogin ? (
            <Signup switchToLogin={() => setShowLogin(true)} />
          ) : (
            <Login switchToSignup={() => setShowLogin(false)} />
          )}
        </div>

        {/* Right Section - Image */}
        {/* <div className="w-full md:w-1/2 flex justify-center items-center ">

         
        </div> */}
        <div className="flex flex-col md:w-1/2 items-center justify-center gap-2 mb-4 text-[]">
          <div className='flex flex-row gap-2 mb-4'>
            <FaComments className="text-4xl text-blue-800" />
            <h1 className='text-4xl font-bold  text-amber-500 '>U<span className='text-4xl font-bold text-blue-800'>chat</span></h1>
          </div>
          <p className='text-blue-600 font-medium text-center text-xl tracking-wider'>Connect Chat & Collaborate</p>
          <img
            src={ChatImage}
            alt="Chat"
            className="w-full max-w-md rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
