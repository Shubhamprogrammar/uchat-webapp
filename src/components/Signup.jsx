import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    username: "",
    dob: null,
    gender: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const GenderOptions = ["Male", "Female", "Other"];
  const host = "http://localhost:5000";
  const navigate = useNavigate();

  const validate = () => {
    let temp = {};
    if (!formData.name.trim()) {
      temp.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{3,}$/.test(formData.name)) {
      temp.name = "Name must be at least 3 letters";
    }
    if (!formData.username.trim()) {
      temp.username = "Username is required";
    } else if (formData.username.length < 3) {
      temp.username = "Username must be at least 3 characters long";
      }else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      temp.username ="Username can contain only letters, numbers, and underscores";
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      temp.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.dob) temp.dob = "DOB is required";
    if (!formData.gender) temp.gender = "Select gender";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!otpSent) {
      if (!validate()) return;

      try {
        await axios.post(`${host}/api/auth/send-otp`, {...formData, label: "signup"});
        setOtpSent(true);
        startTimer();
        toast.success("OTP Sent Successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP, Try again");
      }
      return;
    }


    if (otp.length !== 6) {
      setErrors({ otp: "Enter valid 6-digit OTP" });
      return;
    }

    try {
      const res = await axios.post(`${host}/api/auth/verify-otp`, {
        ...formData,
        otp,
        label: "signup"
      });

      toast.success(res.data.message || "Signup Successful!");
      // navigate('/message');

    } catch (error) {
      console.error("Verify Error:", error);
      toast.error(error.response?.data?.message || "OTP Verification Failed, Try again");
    }
  };

  const startTimer = () => {
    setTimer(120);
    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (timer !== 0) return;

    try {
      await axios.post(`${host}/api/auth/send-otp`, {...formData, label: "signup"});
      startTimer();
      console.log("OTP Resent");
      toast.success("OTP Resent Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP, Try again");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-sm">Join us today and get started</p>
      </div>
      <div className="space-y-3">
        {/* Name Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Elon Musk"
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              value={formData.name}
              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none ${focusedField === 'name'
                ? 'border-blue-500 bg-white shadow-sm'
                : errors.name
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Mobile Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              placeholder="9876543210"
              onChange={handleChange}
              onFocus={() => setFocusedField('mobile')}
              onBlur={() => setFocusedField(null)}
              value={formData.mobile}
              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none ${focusedField === 'mobile'
                ? 'border-blue-500 bg-white shadow-sm'
                : errors.mobile
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            />
          </div>
          {errors.mobile && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="shaananma"
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              value={formData.username}
              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none ${focusedField === 'username'
                ? 'border-blue-500 bg-white shadow-sm'
                : errors.username
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              {errors.username}
            </p>
          )}
        </div>

        {/* DOB and Gender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                value={formData.dob || ''}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none ${errors.dob
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-sm'
                  }`}
              />
            </div>
            {errors.dob && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                {errors.dob}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none ${errors.gender
                ? 'border-red-300'
                : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-sm'
                }`}
            >
              <option value="">Select</option>
              {GenderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.gender && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                {errors.gender}
              </p>
            )}
          </div>
        </div>

        {/* OTP Section */}
        {otpSent && (
          <div className="pt-2 border-t-2 border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none tracking-widest text-center text-lg font-semibold ${errors.otp
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-sm'
                  }`}
              />
            </div>
            {errors.otp && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                {errors.otp}
              </p>
            )}

            {/* Resend OTP */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className={`text-sm cursor-pointer font-medium transition-colors ${timer > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:text-blue-700'
                  }`}
              >
                {timer > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    Resend OTP in {formatTime(timer)}
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-full cursor-pointer text-white transition-all duration-200 shadow-lg transform ${otpSent
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            : 'bg-blue-800 hover:bg-blue-700'
            }`}
        >
          {otpSent ? 'Verify & Sign Up' : 'Send OTP'}
        </button>

        {/* Login Link */}
        <div className="text-center pt-1">
          <p className="text-sm text-gray-600">
            Already having an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-3">
        By signing up, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
};

export default Signup;