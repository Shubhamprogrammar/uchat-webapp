import React, { useState } from 'react';
import ChatImage from '../assets/ChatImage.jpg';
import Signup from '../components/Signup';
import Login from '../components/Login';
import { FaComments } from "react-icons/fa";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-12 lg:gap-16">
        
        {/* Left Section - Branding & Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <FaComments className="text-4xl text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">U</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">chat</span>
              </h1>
            </div>
            
            <p className="text-2xl lg:text-3xl font-semibold text-blue-800 tracking-wide">
              Connect, Chat & Collaborate
            </p>
          </div>
          
          <div className="relative group">
            <div className="relative bg-white p-2">
              <img
                src={ChatImage}
                alt="Chat illustration"
                className="w-full max-w-lg rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2"></div>
            
            {!showLogin ? (
              <Signup switchToLogin={() => setShowLogin(true)} />
            ) : (
              <Login switchToSignup={() => setShowLogin(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
