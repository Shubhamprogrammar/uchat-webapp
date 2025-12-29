import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({ switchToSignup }) => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const [mobile, setMobile] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();
    const host = "http://localhost:5000";

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
                await axios.post(`${host}/api/auth/send-otp`, { mobile, label: "login" });
                setOtpSent(true);
                startTimer();

                toast.success("OTP sent successfully");

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send OTP, Try again");
            }
            return;
        }

        // STEP 2 — Verify OTP
        if (otp.length !== 6) {
            setErrors({ otp: "Enter valid 6-digit OTP" });
            return;
        }

        try {
            const res = await axios.post(`${host}/api/auth/verify-otp`, {
                mobile,
                otp,
                label: "login"
            });
            toast.success(res.data.message || "OTP verified successfully");
            // navigate('/message');
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed, Try again");
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
            await axios.post(`${host}/api/auth/send-otp`, { mobile, label: "login" });
            startTimer();
            toast.success("OTP Resent successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP, Try again");
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-10 w-full max-w-md md:m-auto bg-transparent rounded-lg">
                <h1 className="text-blue-600 font-bold text-3xl  text-center mb-2">Welcome Back !</h1>
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
                            value={mobile}
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
                {!otpSent && <button type="submit" className="border rounded-full p-2 bg-blue-800 text-white hover:bg-blue-700 transition shadow-lg cursor-pointer">Send OTP</button>}
                {otpSent && (
                    <>
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
                                    className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 transition-all duration-200 outline-none tracking-widest text-center text-lg font-semibold ${errors.otp
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

                            {/* RESEND OTP LINK */}
                            <p className="text-sm text-blue-700 cursor-pointer hover:underline w-fit"
                                onClick={handleResend}>
                                {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
                            </p>

                        </div>
                        {/* FINAL SUBMIT BUTTON */}
                        <button className="border rounded-full p-2 bg-green-700 text-white hover:bg-green-600 transition cursor-pointer">
                            Submit
                        </button>
                    </>
                )}
                <p className='text-center text-sm text-gray-600'>Don't have an account?{" "}
                    <span onClick={switchToSignup} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer">Signup</span></p>
            </form>

        </>
    )
}

export default Login;
