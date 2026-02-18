import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = ({ switchToSignup }) => {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const [mobile, setMobile] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const HOST = import.meta.env.VITE_BACKEND_URL;
    const { login } = useAuth();

    const intervalRef = useRef(null);

    /* -------------------- CLEAN TIMER -------------------- */
    const startTimer = () => {
        setTimer(120);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    /* -------------------- VALIDATION -------------------- */
    const validateMobile = () => {
        let temp = {};
        if (!mobile.trim()) {
            temp.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(mobile)) {
            temp.mobile = "Mobile number must be 10 digits";
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    /* -------------------- HANDLERS -------------------- */
    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // digits only
        setMobile(value);
        setErrors(prev => ({ ...prev, mobile: "" }));
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setOtp(value);
        setErrors(prev => ({ ...prev, otp: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!HOST) {
            toast.error("Server configuration error");
            return;
        }

        if (loading) return; // prevent double click
        setLoading(true);

        /* -------- STEP 1: SEND OTP -------- */
        if (!otpSent) {
            if (!validateMobile()) {
                setLoading(false);
                return;
            }
            try {
                await axios.post(`${HOST}/api/auth/send-otp`, {
                    mobile,
                    label: "login"
                });
                setOtpSent(true);
                startTimer();
                toast.success("OTP sent successfully");

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send OTP");
            } finally {
                setLoading(false);
            }
            return;
        }
        if (!/^\d{6}$/.test(otp)) {
            setErrors({ otp: "Enter valid 6-digit OTP" });
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${HOST}/api/auth/verify-otp`, {
                mobile,
                otp,
                label: "login"
            });
            toast.success(res.data.message || "OTP verified successfully");
            login(res.data);
            navigate('/message');
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer !== 0 || loading) return;

        setLoading(true);
        setOtp("");

        try {
            await axios.post(`${HOST}/api/auth/send-otp`, {
                mobile,
                label: "login"
            });

            startTimer();
            toast.success("OTP resent successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    /* -------------------- UI -------------------- */
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-10 w-full max-w-md md:m-auto bg-transparent rounded-lg"
        >
            <h1 className="text-blue-600 font-bold text-3xl text-center mb-2">
                Welcome Back !
            </h1>

            {/* MOBILE FIELD */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                    <span className="text-red-500 ml-0.5">*</span>
                </label>

                <input
                    type="tel"
                    name="mobile"
                    placeholder="9876543210"
                    value={mobile}
                    disabled={otpSent}
                    onChange={handleMobileChange}
                    onFocus={() => setFocusedField('mobile')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none
                        ${otpSent ? "bg-gray-100 border-blue-300 cursor-not-allowed" :
                            focusedField === 'mobile'
                                ? 'border-blue-500 bg-white shadow-sm'
                                : errors.mobile
                                    ? 'border-red-300'
                                    : 'hover:border-blue-300'
                        }`}
                />

                {errors.mobile && (
                    <p className="mt-1.5 text-xs text-red-500">
                        {errors.mobile}
                    </p>
                )}
            </div>

            {/* SEND OTP BUTTON */}
            {!otpSent && (
                <button
                    type="submit"
                    disabled={loading}
                    className={`border rounded-full p-2 text-white transition shadow-lg
                        ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-800 hover:bg-blue-700 cursor-pointer"
                        }`}
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            )}

            {/* OTP SECTION */}
            {otpSent && (
                <>
                    <div className="pt-2 border-t-2 border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>

                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={otp}
                            onChange={handleOtpChange}
                            className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl bg-gray-50 text-center text-lg font-semibold tracking-widest
                                ${errors.otp
                                    ? 'border-red-300'
                                    : 'border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-sm'
                                }`}
                        />

                        {errors.otp && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.otp}
                            </p>
                        )}

                        {/* RESEND */}
                        <p
                            className={`text-sm mt-2 w-fit ${timer > 0 || loading ? "text-gray-400 cursor-not-allowed" : "text-blue-700 hover:underline cursor-pointer"}`}
                            onClick={handleResend}
                        >
                            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
                        </p>
                    </div>

                    {/* VERIFY BUTTON */}
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className={`border rounded-full p-2 text-white transition
                            ${loading || otp.length !== 6
                                ? "bg-green-200 cursor-not-allowed"
                                : "bg-green-700 hover:bg-green-600 cursor-pointer"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </>
            )}

            <p className='text-center text-sm text-gray-600'>
                Don't have an account?{" "}
                <span
                    onClick={switchToSignup}
                    className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                    Signup
                </span>
            </p>
        </form>
    );
};

export default Login;
