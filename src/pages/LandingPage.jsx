import React,{useState} from 'react';
import ChatImage from '../assets/ChatImage.jpg';
import Signup from '../components/Signup';
import Login from '../components/Login';

const LandingPage = () => {
  const [showLogin,setShowLogin]=useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto p-6 gap-8 shadow-lg bg-white rounded-lg">
        
        {/* Left Section - Signup Form */}
        <div className="w-full md:w-1/2 flex justify-center">
          {!showLogin ? (
          <Signup switchToLogin={() => setShowLogin(true)} />
        ) : (
          <Login switchToSignup={() => setShowLogin(false)} />
        )}
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
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
