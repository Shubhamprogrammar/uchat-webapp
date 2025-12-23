import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({ switchToSignup }) => {

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const [mobile, setMobile] = useState("");
    const navigate=useNavigate();

    const validate = () => {
        let temp = {};
        if (!mobile.trim()) {
            temp.mobile = "Mobile number is required";
        }
        else if (!/^\d{10}$/.test(mobile)) {
            temp.mobile = "Mobile number must be 10 digits";
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    }

    const handleChange = (e) => {
        setMobile(
            e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // STEP 1 — Validate form before sending OTP
        if (!otpSent) {
            if (!validate()) return;

            try {
                await axios.post("http://localhost:5000/api/auth/send-otp", {mobile});
                setOtpSent(true);
                startTimer();
                    
                toast.success("OTP Sent successfully");
                
            } catch (error) {
                toast.error("Failed to send OTP,Try Again");
            }
            return;
        }

        // STEP 2 — Verify OTP
        if (otp.length !== 6) {
            setErrors({ otp: "Enter valid 6-digit OTP" });
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                mobile,
                otp,
                label:"login"
            });
            toast.success("Login successfully")
            navigate('/message');
        } catch (error) {
            toast.error("OTP verification failed,Try Again");
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
            await axios.post("http://localhost:5000/api/auth/send-otp", {mobile});
            startTimer();
            toast.success("OTP Resent successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP, Try again");
        }
    };

    const formatTime=(time)=>{
  const minutes=Math.floor(time/60);
  const seconds=time%60;
  return `${minutes}:${seconds<10?'0':''}${seconds}`;

}

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-10 w-full max-w-md md:m-auto bg-transparent rounded-lg">
                <h1 className="text-blue-600 font-bold text-3xl  text-center mb-2">Welcome Back !</h1>
                <input
                    type="text"
                    value={mobile}
                    onChange={handleChange}
                    placeholder="Enter your Mobile number"
                    className="p-2 border border-gray-300 hover:border-blue-400 rounded w-full" />
                {errors.mobile && <p className="text-red-600">{errors.mobile}</p>}
                {!otpSent && <button
                    type="submit" className="border rounded-full p-2 bg-blue-800 text-white hover:bg-blue-700 transition">Send OTP</button>}
                {otpSent && (
                    <>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.otp && <p className="text-red-600">{errors.otp}</p>}

                        {/* RESEND OTP LINK */}
                        <p className="text-sm text-blue-700 cursor-pointer hover:underline w-fit"
                            onClick={handleResend}>
                            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
                        </p>

                        {/* FINAL SUBMIT BUTTON */}
                        <button className="border rounded-full p-2 bg-green-700 text-white hover:bg-green-600 transition">
                            Submit
                        </button>
                    </>
                )}
                <p className='text-center'>Don't have an account?{" "}
                    <span onClick={switchToSignup} className="text-blue-700 font-semibold cursor-pointer">Signup</span></p>
            </form>

        </>
    )
}

export default Login;
