import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Signup = ({switchToLogin}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dob: null,
    gender: "",
    state: "",
    city: "",
  });
  const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [timer, setTimer] = useState(0);


  const [errors, setErrors] = useState({});

   const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "42px",
      height: "42px",
      borderRadius: "0.375rem",
      borderColor: state.isFocused ? "#60a5fa" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(96,165,250,0.4)" : "none",
      "&:hover": { borderColor: "#60a5fa" },
      transition: "border-color 0.1s ease, box-shadow 0.1s ease",
      boxSizing: "border-box",
      width: "100%", 
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "42px",
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (provided) => ({ ...provided, padding: "4px" }),
    placeholder: (provided) => ({ ...provided, color: "#6b7280" }),
    singleValue: (provided) => ({ ...provided, color: "#374151" }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      zIndex: 50,
    }),
  };
  // ---------------- VALIDATION ----------------
  const validate = () => {
    let temp = {};

    if (!formData.name.trim()) {
      temp.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{3,}$/.test(formData.name)) {
      temp.name = "Name must be at least 3 letters";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      temp.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.dob) temp.dob = "DOB is required";
    if (!formData.gender) temp.gender = "Select gender";
    if (!formData.state) temp.state = "Select state";
    if (!formData.city) temp.city = "Select city";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SUBMIT ----------------
 const handleSubmit = async (e) => {
  e.preventDefault();

  // STEP 1 — Validate form before sending OTP
  if (!otpSent) {
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", formData);
      setOtpSent(true);
      startTimer();
      console.log("OTP Sent");
    } catch (error) {
      console.error("OTP Error:", error);
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
      ...formData,
      otp,
      label:"signup"
    });
    console.log("Signup Successful", res.data);
  } catch (error) {
    console.error("Verify Error:", error);
  }
};

const startTimer = () => {
  setTimer(120); // 30 sec cooldown
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
    await axios.post("http://localhost:5000/api/auth/send-otp", formData);
    startTimer();
    console.log("OTP Resent");
  } catch (error) {
    console.error(error);
  }
};



  const GenderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const StateOptions = [
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Gujrat", label: "Gujrat" },
    { value: "Karnataka", label: "Karnataka" },
  ];

  const CityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Surat", label: "Surat" },
    { value: "Bengaluru", label: "Bengaluru" },
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-10 w-full max-w-md bg-white rounded-lg "
      >
        <h1 className="text-yellow-400 font-bold text-3xl text-center mb-2">
          SignUp
        </h1>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Enter your Name"
          onChange={handleChange}
          value={formData.name}
          className="p-2 border border-gray-300 hover:border-blue-400 rounded w-full"
        />
        {errors.name && <p className="text-red-600">{errors.name}</p>}

        {/* MOBILE */}
        <input
          type="tel"
          name="mobile"
          placeholder="Enter your Mobile Number"
          onChange={handleChange}
          value={formData.mobile}
          className="p-2 border border-gray-300 hover:border-blue-400 rounded w-full"
        />
        {errors.mobile && <p className="text-red-600">{errors.mobile}</p>}

        {/* BUTTON TO SEND OTP IF NOT SENT */}



        {/* DOB + GENDER */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-1/2">
            <DatePicker
              selected={formData.dob}
              showYearDropdown 
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              
              onChange={(date) =>
                setFormData({ ...formData, dob: date })
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Date of Birth"
              className="p-2 border border-gray-300 hover:border-blue-400 rounded w-full"
            />
            {errors.dob && <p className="text-red-600">{errors.dob}</p>}
          </div>

          <div className="w-full sm:w-1/2">
            <Select
              name="gender"
              styles={customSelectStyles}
              options={GenderOptions}
              placeholder="Gender"
              value={GenderOptions.find(
                (opt) => opt.value === formData.gender
              )}
              onChange={(opt) =>
                setFormData({ ...formData, gender: opt.value })
              }
            />
            {errors.gender && (
              <p className="text-red-600">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* STATE + CITY */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-1/2">
            <Select
            styles={customSelectStyles}
              name="state"
              options={StateOptions}
              placeholder="Select State"
              value={StateOptions.find(
                (opt) => opt.value === formData.state
              )}
              onChange={(opt) =>
                setFormData({ ...formData, state: opt.value })
              }
            />
            {errors.state && (
              <p className="text-red-600">{errors.state}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2">
            <Select
              name="city"
              options={CityOptions}
              styles={customSelectStyles}
              placeholder="Select City"
              value={CityOptions.find(
                (opt) => opt.value === formData.city
              )}
              onChange={(opt) =>
                setFormData({ ...formData, city: opt.value })
              }
            />
            {errors.city && <p className="text-red-600">{errors.city}</p>}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        {!otpSent && (
  <button className="border rounded-full p-2 bg-blue-800 text-white hover:bg-blue-700 transition">
    Send OTP
  </button>
)}

{/* OTP INPUT APPEARS AFTER SENDING OTP */}
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
      {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
    </p>

    {/* FINAL SUBMIT BUTTON */}
    <button className="border rounded-full p-2 bg-green-700 text-white hover:bg-green-600 transition">
      Submit
    </button>
  </>
)}

        <p className="text-center">
          Already have an account?{" "}
          <span onClick={switchToLogin} className="text-blue-700 font-semibold cursor-pointer">Login</span>
        </p>
      </form>
    </>
  );
};

export default Signup;
