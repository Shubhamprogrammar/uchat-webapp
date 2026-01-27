import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const HOST = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("token");

  // Fetch user
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${HOST}/api/auth/self-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${HOST}/api/auth/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-amber-50 flex justify-center items-center">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-36 h-36 mx-auto bg-gray-300 text-amber-600 rounded-full flex items-center justify-center text-6xl font-bold mb-3">
            {user?.username?.charAt(0) || "U"}
          </div>
          <h2 className="text-3xl font-bold text-blue-900">{user?.name}</h2>
          <p className="text-xl text-blue-700">@{user?.username}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-gray-700">

          {/* Username */}
          <div className="flex items-center gap-3">
            <FaUser className="text-blue-700" />
            <span className="text-2xl font-semibold">Username:</span>

            {isEditing ? (
              <input
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              <span className="text-xl">{user.username}</span>
            )}
          </div>

          {/* Mobile (locked) */}
          <div className="flex items-center gap-3">
            <FaPhone className="text-blue-700" />
            <span className="text-2xl font-semibold">Mobile:</span>
            <span className="text-gray-700 text-xl">{user.mobile}</span>
          </div>

          {/* Gender (locked) */}
          <div className="flex items-center gap-3">
            <FaVenusMars className="text-blue-700" />
            <span className="text-2xl font-semibold">Gender:</span>
            <span className="text-gray-700 text-xl">{user.gender}</span>
          </div>

          {/* DOB */}
          <div className="flex items-center gap-3">
            <FaBirthdayCake className="text-blue-700" />
            <span className="text-2xl font-semibold">DOB:</span>
            <span className="text-gray-700 text-xl">
              {user?.dob ? new Date(user.dob).toDateString() : "N/A"}
            </span>
          </div>

        </div>


        {/* Footer */}
        <div className="border-t p-4 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-amber-500 text-white py-2 rounded hover:bg-amber-600 cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFormData(user);
                  setIsEditing(false);
                }}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg cursor-pointer"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
